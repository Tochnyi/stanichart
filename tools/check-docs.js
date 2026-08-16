#!/usr/bin/env node
'use strict';

/**
 * Tochnyi Charts — documentation-integrity check.
 *
 * Purpose: mechanically verify that the repository's current authority
 * documents reference real files, so documentation cannot drift from the
 * tree it describes (STANDARDS.md section 28).
 *
 * Owns: link and file-reference resolution for the root markdown authorities.
 * Reads: `README.md`, `AGENTS.md`, `STATUS.md`, `TESTING.md`, and the documented
 * entry points they name.
 * Mutates: nothing. Read-only and offline.
 * Does not own: semantic contradiction between documents or between a document
 * and source code; those still require review.
 * Canonical operation: run by `npm test` together with `tools/check-charts.js`.
 * Relevant invariants: every local markdown link resolves; every backticked
 * path in prose (outside code fences) resolves; the documented entry points
 * exist.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DOC_FILES = ['README.md', 'AGENTS.md', 'STATUS.md', 'TESTING.md'];

// Entry points the authorities should be able to point at.
const DOCUMENTED_PATHS = [
    'reference.html',
    'build-share.py',
    'package.json',
    'lib/tochnyi.css',
    'lib/tochnyi-charts.js',
    'lib/tochnyi-logo.png',
    'lib/watermark.svg',
    'tools/check-charts.js',
    'tools/check-docs.js',
    '.claude/skills/tochnyi-chart.md',
];

// Tokens that are clearly patterns rather than concrete paths.
const PATTERN_LIKE = /[A-Z]{2,}|\*|\?|<|>|\{\}|\.\.\./;

// Backticked prose tokens are path references only when they are relative
// paths under a known directory or an exact known root file. File-name
// mentions and commands are not references.
const RELATIVE_PATH = /^(\.{1,2}\/|lib\/|tools\/|charts\/|docs\/|\.claude\/)/;
const KNOWN_ROOT_FILES = new Set([
    ...DOC_FILES,
    'reference.html',
    'build-share.py',
    'package.json',
    'index.html',
    'input.txt',
    'build.rs',
]);

const failures = [];
let linksChecked = 0;

function fail(doc, message) {
    failures.push(`${doc}: ${message}`);
}

function resolveTarget(doc, target) {
    const docDir = path.dirname(path.join(ROOT, doc));
    return path.resolve(docDir, target);
}

function exists(target) {
    return fs.existsSync(path.resolve(ROOT, target));
}

function checkTarget(doc, target) {
    linksChecked++;
    const cleaned = target.split('#')[0];
    if (!cleaned || PATTERN_LIKE.test(cleaned)) return;
    // Bare directory prefixes are explanatory, not file references.
    if (cleaned.endsWith('/')) return;
    if (/^(https?:\/\/|mailto:|\/)/.test(cleaned)) return;
    const resolved = resolveTarget(doc, cleaned);
    if (!fs.existsSync(resolved)) {
        fail(doc, `reference does not resolve: ${cleaned}`);
    }
}

// Extract markdown links and prose backticked paths, skipping code fences.
function extractReferences(text) {
    const refs = [];
    let inFence = false;
    for (const line of text.split('\n')) {
        if (/^\s*```/.test(line)) {
            inFence = !inFence;
            continue;
        }
        if (inFence) continue;
        const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
        let m;
        while ((m = linkRe.exec(line))) refs.push(m[1]);
        const tickRe = /`([^`]+)`/g;
        while ((m = tickRe.exec(line))) {
            const tok = m[1];
            if (RELATIVE_PATH.test(tok) || KNOWN_ROOT_FILES.has(tok)) {
                refs.push(tok);
            }
        }
    }
    return refs;
}

function main() {
    for (const entry of DOCUMENTED_PATHS) {
        if (!exists(entry)) {
            fail(entry, 'documented entry point does not exist');
        }
    }

    for (const doc of DOC_FILES) {
        const filePath = path.join(ROOT, doc);
        if (!fs.existsSync(filePath)) {
            fail(doc, 'authority document is missing');
            continue;
        }
        const text = fs.readFileSync(filePath, 'utf8');
        for (const target of extractReferences(text)) {
            checkTarget(doc, target);
        }
    }

    if (failures.length > 0) {
        console.error(`FAILED: ${failures.length} documentation issue(s)`);
        for (const f of failures) {
            console.error('  - ' + f);
        }
        process.exit(1);
    }

    console.log(`OK: ${linksChecked} documentation reference(s) checked`);
}

main();
