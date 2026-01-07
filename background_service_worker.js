// Service Worker entry for ClearURLs (Manifest v3 migration)
// Loads existing background scripts via importScripts so core logic remains untouched.
// Note: MV3 SW runs in worker context; window is undefined. Most existing code relies on browser.* APIs which are still available.

// --- Compatibility Polyfill ---
// Ensure scripts expecting 'window' can access globalThis in Worker.
if (typeof window === 'undefined' && typeof self !== 'undefined') {
  self.window = self;
}
if (typeof self !== 'undefined') {
  const br = (typeof browser !== 'undefined') ? browser : (typeof chrome !== 'undefined' ? chrome : undefined);
  if (br) {
    if (!br.browserAction && br.action) {
      br.browserAction = br.action;
    }
  }
}

// --- Prevent invalid blocking webRequest listeners in MV3 (Chrome) ---
if (typeof chrome !== 'undefined' && chrome.declarativeNetRequest) {
  const wr = chrome.webRequest;
  if (wr && wr.onBeforeRequest) {
    const originalAdd = wr.onBeforeRequest.addListener;
    wr.onBeforeRequest.addListener = function (listener, filter, opt_extraInfoSpec) {
      if (Array.isArray(opt_extraInfoSpec) && opt_extraInfoSpec.includes('blocking')) {
        console.warn('Skipped adding blocking webRequest listener in MV3');
        return;
      }
      return originalAdd.call(this, listener, filter, opt_extraInfoSpec);
    };
  }
}

const scripts = [
  'browser-polyfill.js',
  'core_js/utils/Multimap.js',
  'core_js/utils/URLHashParams.js',
  'core_js/message_handler.js',
  'external_js/ip-range-check.js',
  'core_js/tools.js',
  'core_js/dnr_converter.js',
  'core_js/badgedHandler.js',
  'core_js/pureCleaning.js',
  'core_js/context_menu.js',
  'core_js/historyListener.js',
  'clearurls.js',
  'core_js/storage.js',
  'core_js/watchdog.js',
  'core_js/eTagFilter.js'
];

importScripts(...scripts);

// --- DNR Rule Update Logic ---
async function updateDNRRules() {
  try {
    const data = await chrome.storage.local.get("ClearURLsData");
    if (data && data.ClearURLsData) {
      let json;
      try {
        // Storage might contain the stringified JSON or the object depending on how it was saved.
        // core_js/storage.js seems to save it stringified.
        if (typeof data.ClearURLsData === 'string') {
          json = JSON.parse(data.ClearURLsData);
        } else {
          json = data.ClearURLsData;
        }
      } catch (e) {
        console.error("ClearURLs: Invalid JSON in storage", e);
        return;
      }

      if (!json) return;

      const preparedRules = convertProvidersToDNR(json);

      const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
      // We use IDs >= 1000 for converted rules. Preserve 1-999 (static internal rules).
      const removeRuleIds = existingRules.filter(r => r.id >= 1000).map(r => r.id);

      // Attempt to update. If it fails due to a specific rule, try to exclude it.
      // We can try a few times.
      let rulesToInstall = [...preparedRules];
      let success = false;
      let attempt = 0;

      while (!success && attempt < 5) {
        try {
          await chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: removeRuleIds, // Only need to remove on the first success, but doing it every time is safe or idempotent?
            // Actually no, if we loop, we want to remove the OLD ones, and add the NEW ones.
            // If we fail, nothing happens. So it's safe to keep sending the same removeRuleIds.
            addRules: rulesToInstall
          });
          success = true;
        } catch (ruleError) {
          attempt++;
          const errorMessage = ruleError.message || "";

          // Try to parse the Rule ID from error message: "Rule with id 1114 was skipped..."
          const match = errorMessage.match(/Rule with id (\d+)/);
          if (match && match[1]) {
            const badId = parseInt(match[1], 10);
            rulesToInstall = rulesToInstall.filter(r => r.id !== badId);
          } else {
            // If we can't identify the specific rule, we can't fix it by exclusion.
            console.error("ClearURLs: Failed to update DNR rules", ruleError);
            break;
          }
        }
      }
    }
  } catch (err) {
    console.error("ClearURLs: Error updating DNR rules", err);
  }
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.ClearURLsData) {
    updateDNRRules();
  }
});

// Run on startup
chrome.runtime.onStartup.addListener(updateDNRRules);

// Optionally listen for install/update to (re)initialize declarativeNetRequest rules later.
chrome.runtime.onInstalled.addListener(() => {
  fetch('dnr_rules.json')
    .then(r => r.json())
    .then(rules => {
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules,
        removeRuleIds: rules.map(r => r.id)
      }, () => {
        console.log('DNR static rules loaded');
        // After static rules, load dynamic ones
        updateDNRRules();
      });
    });
  console.log('ClearURLs service worker installed.');
});
