const fs = require('fs');
const path = require('path');

const esPath = path.resolve('src/assets/i18n/es.json');
const enPath = path.resolve('src/assets/i18n/en.json');

const es = JSON.parse(fs.readFileSync(esPath, 'utf8'));
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const esKeys = Object.keys(es).sort();
const enKeys = Object.keys(en).sort();

const missingInEn = esKeys.filter(key => !enKeys.includes(key));
const missingInEs = enKeys.filter(key => !esKeys.includes(key));

console.log('--- i18n Sync Report ---');
if (missingInEn.length === 0 && missingInEs.length === 0) {
    console.log('✅ All keys are synced!');
} else {
    if (missingInEn.length > 0) {
        console.log('❌ Keys missing in en.json:', missingInEn);
    }
    if (missingInEs.length > 0) {
        console.log('❌ Keys missing in es.json:', missingInEs);
    }
}

// Check nested objects if any (some are arrays of objects)
// For this project, descriptions and paragraphs are arrays, and skills are arrays of objects/strings.
// The script above only checks top-level keys. Let's do a deeper check for specific sections.

function checkNestedArrays(key) {
    if (Array.isArray(es[key]) && Array.isArray(en[key])) {
        if (es[key].length !== en[key].length) {
            console.log(`⚠️ Length mismatch in ${key}: ES=${es[key].length}, EN=${en[key].length}`);
        }
    }
}

['AboutMe.Paragraphs', 'AboutMe.Skills', 'Experience.Jobs', 'FeatureProjects.Projects', 'SoftSkills.Description', 'SoftSkills.Skills'].forEach(checkNestedArrays);
