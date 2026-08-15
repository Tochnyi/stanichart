#!/usr/bin/env node
'use strict';

/**
 * Tochnyi Charts — repository verification lane.
 *
 * Purpose: mechanically verify that every published chart (both standard charts
 * that reference `lib/` and self-contained `*-share.html` files produced by
 * `build-share.py`) and the master reference conform to the shared design-system
 * contract, so a cold agent can prove conformance without opening a browser.
 *
 * Owns: the structural contract checks for `charts/**` and `reference.html`.
 * Reads: all `.html` files under `charts/`, `reference.html`, and `lib/`.
 * Mutates: nothing. This lane is strictly read-only and offline.
 * Does not own: visual rendering quality, runtime console errors, or the
 * factual correctness of chart claims. Those lanes are manual and documented
 * in `TESTING.md`.
 * Canonical operation: `npm test` (runs `node tools/check-charts.js`).
 * Relevant invariants: week folders are `YYYY-week-WW`; every chart carries the
 * universal contract; AMCharts charts wire the CDN, `chartdiv`, `am5.ready`,
 * and `lib/tochnyi-charts.js`; every local asset reference resolves.
 * Focused tests: none — this script IS the lane, exercised by `npm test`.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHARTS_DIR = path.join(ROOT, 'charts');
const REFERENCE = path.join(ROOT, 'reference.html');
const LIB_DIR = path.join(ROOT, 'lib');

const WEEK_RE = /^\d{4}-week-\d{2}$/;
const REQUIRED_LIB_FILES = [
    'tochnyi.css',
    'tochnyi-charts.js',
    'tochnyi-logo.png',
    'watermark.svg',
];

// Universal contract required of every published chart.
const chartUniversalChecks = [
    ['HTML doctype', /^<!DOCTYPE html>/i],
    ['html lang="en"', /<html\s+lang="en"/i],
    ['charset UTF-8', /charset="UTF-8"/i],
    ['viewport meta', /name="viewport"/i],
    ['non-empty <title>', /<title>\s*\S/i],
    ['Mukta font', /fonts\.googleapis\.com\/css2\?family=Mukta/i],
    ['tochnyi.css reference', /tochnyi\.css/],
    ['tochnyi-chart wrapper', /class="tochnyi-chart"/],
    ['tochnyi-header', /class="tochnyi-header"/],
    ['tochnyi-logo', /tochnyi-logo/],
    ['tochnyi-date', /class="tochnyi-date"/],
    ['tochnyi-title', /class="tochnyi-title"/],
    ['tochnyi-subtitle', /class="tochnyi-subtitle"/],
    ['tochnyi-source', /class="tochnyi-source"/],
    ['tochnyi-footer', /class="tochnyi-footer"/],
    ['analysis attribution', /x\.com\/delfoo/],
];

// Subset of the contract that reference.html must also satisfy.
const referenceUniversalChecks = [
    ['HTML doctype', /^<!DOCTYPE html>/i],
    ['html lang="en"', /<html\s+lang="en"/i],
    ['charset UTF-8', /charset="UTF-8"/i],
    ['viewport meta', /name="viewport"/i],
    ['non-empty <title>', /<title>\s*\S/i],
    ['Mukta font', /fonts\.googleapis\.com\/css2\?family=Mukta/i],
    ['tochnyi.css reference', /tochnyi\.css/],
    ['tochnyi-header', /class="tochnyi-header"/],
    ['tochnyi-logo', /tochnyi-logo/],
    ['tochnyi-date', /class="tochnyi-date"/],
    ['tochnyi-title', /class="tochnyi-title"/],
    ['tochnyi-subtitle', /class="tochnyi-subtitle"/],
    ['tochnyi-footer', /class="tochnyi-footer"/],
    ['analysis attribution', /x\.com\/delfoo/],
];

// Additional contract when a chart is an interactive AMCharts chart.
const amChartsChecks = [
    ['amCharts index.js', /cdn\.amcharts\.com\/lib\/5\/index\.js/],
    ['chartdiv container', /id="chartdiv"/],
    ['am5.ready bootstrap', /am5\.ready\(/],
    ['tochnyi-charts.js helper', /tochnyi-charts\.js/],
];

// Self-contained share files (`*-share.html`, produced by build-share.py) inline
// the CSS, helper JS, logo, and watermark, so they must NOT reference local
// lib/ assets and must still carry the chart's narrative structure and CDN
// chart wiring.
function isShareFile(name) {
    return /-share\.html$/i.test(name);
}

const shareUniversalChecks = [
    ['HTML doctype', /^<!DOCTYPE html>/i],
    ['html lang="en"', /<html\s+lang="en"/i],
    ['charset UTF-8', /charset="UTF-8"/i],
    ['viewport meta', /name="viewport"/i],
    ['non-empty <title>', /<title>\s*\S/i],
    ['Mukta font', /fonts\.googleapis\.com\/css2\?family=Mukta/i],
    ['tochnyi-chart wrapper', /class="tochnyi-chart"/],
    ['tochnyi-title', /class="tochnyi-title"/],
    ['tochnyi-subtitle', /class="tochnyi-subtitle"/],
    ['tochnyi-source', /class="tochnyi-source"/],
    ['tochnyi-footer', /class="tochnyi-footer"/],
    ['analysis attribution', /x\.com\/delfoo/],
];

const shareAmChartsChecks = [
    ['amCharts CDN', /cdn\.amcharts\.com/],
    ['am5.ready bootstrap', /am5\.ready\(/],
    ['chart container', /id="chartdiv\w*"/],
];

// A share file that still references a local lib/ asset is not self-contained.
const SHARE_LOCAL_REF = /(?:src|href)="(?:\.{1,2}\/)*lib\/|tochnyi-(?:logo\.png|watermark\.svg|charts\.js)/;

// reference.html-specific expectations beyond the universal contract.
const referenceChecks = [
    ['lib/tochnyi.css', /href="lib\/tochnyi\.css"/],
    ['lib/tochnyi-charts.js', /src="lib\/tochnyi-charts\.js"/],
    ['bar demo container', /id="barChartDemo"/],
    ['grouped bar demo container', /id="groupedBarDemo"/],
    ['line demo container', /id="lineChartDemo"/],
    ['pie demo container', /id="pieChartDemo"/],
    ['HTML template section', /id="template"/],
    ['CHART METADATA provenance block', /CHART METADATA/],
];

const failures = [];
let chartsChecked = 0;
let assetsChecked = 0;
let chartsMissingMetadata = 0;

function relative(p) {
    return path.relative(ROOT, p).replace(/\\/g, '/');
}

function fail(file, message) {
    failures.push(`${relative(file)}: ${message}`);
}

function missingChecks(src, checks) {
    const missing = [];
    for (const [name, re] of checks) {
        if (!re.test(src)) missing.push(name);
    }
    return missing;
}

function localAssetRefs(src) {
    const refs = [];
    const re = /(?:src|href)="([^"]+)"/g;
    let m;
    while ((m = re.exec(src))) {
        const ref = m[1];
        if ((ref.startsWith('./') || ref.startsWith('../') || ref.startsWith('lib/')) && !ref.includes('#')) {
            refs.push(ref);
        }
    }
    return refs;
}

function checkLocalAssets(filePath, src) {
    const baseDir = path.dirname(filePath);
    for (const ref of localAssetRefs(src)) {
        assetsChecked++;
        if (!fs.existsSync(path.resolve(baseDir, ref))) {
            fail(filePath, `referenced asset does not exist: ${ref}`);
        }
    }
}

function checkHtmlFile(filePath, share) {
    let src;
    try {
        src = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        fail(filePath, `unreadable: ${err.message}`);
        return;
    }

    if (share) {
        for (const name of missingChecks(src, shareUniversalChecks)) {
            fail(filePath, `share file missing ${name}`);
        }
        if (/cdn\.amcharts\.com/.test(src) || /\bam5\./.test(src)) {
            for (const name of missingChecks(src, shareAmChartsChecks)) {
                fail(filePath, `share file missing ${name}`);
            }
        }
        if (SHARE_LOCAL_REF.test(src)) {
            fail(filePath, 'share file references a local lib/ asset instead of being self-contained');
        }
        return;
    }

    for (const name of missingChecks(src, chartUniversalChecks)) {
        fail(filePath, `missing ${name}`);
    }

    const usesAmCharts = /cdn\.amcharts\.com/.test(src) || /\bam5\./.test(src);
    if (usesAmCharts) {
        for (const name of missingChecks(src, amChartsChecks)) {
            fail(filePath, `AMCharts chart missing ${name}`);
        }
    }

    checkLocalAssets(filePath, src);

    if (!/CHART METADATA/.test(src)) {
        chartsMissingMetadata++;
    }
}

function main() {
    for (const file of REQUIRED_LIB_FILES) {
        if (!fs.existsSync(path.join(LIB_DIR, file))) {
            fail(path.join('lib', file), 'required shared library file is missing');
        }
    }

    if (!fs.existsSync(REFERENCE)) {
        fail('reference.html', 'master reference is missing');
    } else {
        const src = fs.readFileSync(REFERENCE, 'utf8');
        for (const name of missingChecks(src, referenceUniversalChecks)) {
            fail('reference.html', `missing ${name}`);
        }
        for (const name of missingChecks(src, referenceChecks)) {
            fail('reference.html', `missing ${name}`);
        }
        checkLocalAssets(REFERENCE, src);
    }

    if (!fs.existsSync(CHARTS_DIR)) {
        fail('charts/', 'directory does not exist');
    } else {
        for (const week of fs.readdirSync(CHARTS_DIR)) {
            const weekDir = path.join(CHARTS_DIR, week);
            if (!fs.statSync(weekDir).isDirectory()) {
                fail(`charts/${week}`, 'unexpected non-directory entry in charts/');
                continue;
            }
            if (!WEEK_RE.test(week)) {
                fail(`charts/${week}`, `week folder must be YYYY-week-WW (zero-padded week), got "${week}"`);
                continue;
            }
            for (const file of fs.readdirSync(weekDir)) {
                const full = path.join(weekDir, file);
                if (file.endsWith('.html')) {
                    chartsChecked++;
                    checkHtmlFile(full, isShareFile(file));
                } else if (file.endsWith('.pptx')) {
                    // Generated delivery deck: allowed, contents are not validated here.
                } else {
                    fail(full, 'unexpected file type in chart week folder (allowed: .html, .pptx)');
                }
            }
        }
    }

    if (failures.length > 0) {
        console.error(`FAILED: ${failures.length} issue(s)`);
        for (const f of failures) {
            console.error('  - ' + f);
        }
        process.exit(1);
    }

    console.log(`OK: ${chartsChecked} chart(s), reference.html, ${assetsChecked} asset reference(s) checked`);
    if (chartsMissingMetadata > 0) {
        console.warn(
            `Advisory: ${chartsMissingMetadata} chart(s) lack the CHART METADATA provenance block ` +
            'from the reference template; they predate the current generation contract.'
        );
    }
}

main();
