const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.html')) {
        filelist.push(dir + '/' + file);
      }
    }
  });
  return filelist;
};

const srcFiles = walkSync('./src');

srcFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Backgrounds
  content = content.replace(/bg-slate-50 dark:bg-gray-900/g, 'bg-background');
  content = content.replace(/bg-\[\#F8FAFC\] dark:bg-gray-900/g, 'bg-background');
  content = content.replace(/bg-slate-50 dark:bg-gray-800/g, 'bg-background'); // Just in case
  
  content = content.replace(/bg-white dark:bg-gray-800/g, 'bg-surface');
  content = content.replace(/bg-white dark:bg-gray-900/g, 'bg-surface'); // Some cards use this
  content = content.replace(/bg-slate-100 dark:bg-gray-700/g, 'bg-surface-hover');
  content = content.replace(/bg-slate-50 dark:bg-gray-700/g, 'bg-surface-hover');
  content = content.replace(/hover:bg-slate-50 dark:hover:bg-gray-700/g, 'hover:bg-surface-hover');
  content = content.replace(/hover:bg-slate-100 dark:hover:bg-gray-600/g, 'hover:bg-surface-hover');
  content = content.replace(/dark:bg-gray-900 dark:hover:bg-gray-700/g, 'dark:bg-surface dark:hover:bg-surface-hover');

  // Borders
  content = content.replace(/border-slate-200 dark:border-gray-700/g, 'border-border');
  content = content.replace(/border-slate-100 dark:border-gray-700/g, 'border-border');
  content = content.replace(/border-slate-300 dark:border-gray-600/g, 'border-border-focus');
  content = content.replace(/hover:border-slate-300 dark:border-gray-600 dark:hover:border-gray-500/g, 'hover:border-border-focus dark:hover:border-border-focus');
  
  // Text
  content = content.replace(/text-slate-900 dark:text-white/g, 'text-text-main');
  content = content.replace(/text-slate-800 dark:text-gray-100/g, 'text-text-main');
  content = content.replace(/text-slate-700 dark:text-gray-200/g, 'text-text-main');
  content = content.replace(/text-slate-700 dark:text-gray-300/g, 'text-text-main');
  
  content = content.replace(/text-slate-600 dark:text-gray-300/g, 'text-text-muted');
  content = content.replace(/text-slate-500 dark:text-gray-400/g, 'text-text-muted');
  
  content = content.replace(/text-slate-400 dark:text-gray-500/g, 'text-text-subtle');
  content = content.replace(/hover:text-slate-600 dark:text-gray-300 dark:hover:text-gray-300/g, 'hover:text-text-muted dark:hover:text-text-main');
  content = content.replace(/hover:text-slate-600 dark:hover:text-gray-200/g, 'hover:text-text-main dark:hover:text-text-main');
  
  // Primary Color
  content = content.replace(/text-blue-600 dark:text-blue-400/g, 'text-primary');
  content = content.replace(/text-blue-600/g, 'text-primary');
  content = content.replace(/bg-blue-600 hover:bg-blue-700/g, 'bg-primary hover:bg-primary-hover');
  content = content.replace(/bg-blue-500\/10/g, 'bg-primary\/10');
  content = content.replace(/text-blue-500/g, 'text-primary');
  content = content.replace(/border-blue-500 dark:focus:border-blue-400/g, 'border-primary dark:focus:border-primary');
  content = content.replace(/focus:border-blue-500/g, 'focus:border-primary');
  content = content.replace(/focus:ring-blue-500\/20/g, 'focus:ring-primary\/20');
  content = content.replace(/focus-visible:ring-blue-500\/30/g, 'focus-visible:ring-primary\/30');
  
  // Indigo / Accents
  content = content.replace(/from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-400/g, 'from-primary to-accent dark:from-primary dark:to-accent');
  content = content.replace(/text-amber-500/g, 'text-accent');
  content = content.replace(/bg-amber-500/g, 'bg-accent');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
