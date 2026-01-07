/*
 * ClearURLs - DNR Converter
 * Converts internal ClearURLs providers to declarativeNetRequest rules.
 */

const MAX_DYNAMIC_RULES = 5000;
const MAX_REGEX_LENGTH = 1024; // Conservative limit to avoid 2KB compiled size memory error

/**
 * Checks if a regex string is likely safe for Chrome's RE2 engine.
 * RE2 does not support lookaheads (?!, ?=), lookbehinds (?<=, ?<!), or backreferences (\1) in the match pattern.
 * Note: Backreferences are allowed in the substitution string, but not the filter.
 * @param {string} regexStr 
 * @returns {boolean}
 */
function isSafeRe2(regexStr) {
    if (!regexStr) return false;

    // Check length
    if (regexStr.length > MAX_REGEX_LENGTH) return false;

    // Check for lookaheads/lookbehinds: (?=, (?!, (?<=, (?<!
    if (/\(\?=[^)]/.test(regexStr) || /\(\?![^)]/.test(regexStr) ||
        /\(\?<=[^)]/.test(regexStr) || /\(\?<![^)]/.test(regexStr)) {
        return false;
    }
    // Check for backreferences in pattern (e.g. \1) - simplistic check
    // Identifying \1 vs escaped 1 is hard with simple regex, but let's try to be conservative.
    // If it has \1 and it's not \\1, it's suspect.
    if (/\\(?!\\)\d/.test(regexStr)) {
        // This is a bit aggressive, might catch valid things, but safer to skip than crash.
        // Actually, \1 is very common in ClearURLs redirections? No, usually in substitution.
        // In regex, \1 refers to capture group 1. RE2 doesn't support this in the *match*.
        return false;
    }
    return true;
}

/**
 * Converts the full ClearURLsData object into a list of DNR rules.
 * @param {Object} clearURLsData - The parsed JSON data from storage.ClearURLsData
 * @returns {Object[]} rules - Array of declarativeNetRequest rules
 */
function convertProvidersToDNR(clearURLsData) {
    const rules = [];
    let idCounter = 1000; // Start IDs from 1000 to avoid conflict with static rules

    if (!clearURLsData || !clearURLsData.providers) {
        console.warn("ClearURLs: No providers data found for DNR conversion.");
        return rules;
    }

    // Helper to generate a unique ID
    const nextId = () => idCounter++;

    const providers = Object.keys(clearURLsData.providers);

    for (const providerName of providers) {
        if (rules.length >= MAX_DYNAMIC_RULES) {
            console.warn("ClearURLs: Reached dynamic rule limit. Stopping conversion.");
            break;
        }

        const provider = clearURLsData.providers[providerName];

        // 1. Exceptions (Highest Priority: 100)
        if (provider.exceptions && Array.isArray(provider.exceptions)) {
            for (const exceptionRegex of provider.exceptions) {
                if (rules.length >= MAX_DYNAMIC_RULES) break;
                if (!isSafeRe2(exceptionRegex)) continue;

                try {
                    rules.push({
                        id: nextId(),
                        priority: 100,
                        action: { type: "allow" },
                        condition: {
                            regexFilter: exceptionRegex,
                            resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest", "ping", "image", "other"]
                        }
                    });
                } catch (e) { }
            }
        }

        // 2. Redirections (High Priority: 50)
        if (provider.redirections && Array.isArray(provider.redirections)) {
            for (const redirectionRegex of provider.redirections) {
                if (rules.length >= MAX_DYNAMIC_RULES) break;
                if (!isSafeRe2(redirectionRegex)) continue;

                try {
                    rules.push({
                        id: nextId(),
                        priority: 50,
                        action: {
                            type: "redirect",
                            redirect: {
                                regexSubstitution: "\\1" // Assuming first capture group is target
                            }
                        },
                        condition: {
                            regexFilter: redirectionRegex,
                            resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest"]
                        }
                    });
                } catch (e) {
                    console.warn(`ClearURLs: Failed to convert redirection rule: ${redirectionRegex}`, e);
                }
            }
        }

        // 3. Parameter Removal (Normal Priority: 10)
        const simpleParams = [];
        if (provider.rules && Array.isArray(provider.rules)) {
            provider.rules.forEach(rule => {
                // Remove ^ and $ anchors if present
                const cleanedRule = rule.replace(/^\^|\$$/g, '');

                // Exact match alphanumeric check (plus underscores/dashes)
                if (/^[a-zA-Z0-9_\-]+$/.test(cleanedRule)) {
                    simpleParams.push(cleanedRule);
                }
            });
        }

        if (simpleParams.length > 0 && rules.length < MAX_DYNAMIC_RULES) {
            // Scope to provider's URL pattern if safe
            let filter = {};
            if (provider.urlPattern && isSafeRe2(provider.urlPattern)) {
                filter.regexFilter = provider.urlPattern;
            } else {
                // Default to global if no safe/valid pattern
                filter.urlFilter = "*";
            }

            rules.push({
                id: nextId(),
                priority: 10,
                action: {
                    type: "redirect",
                    redirect: {
                        transform: {
                            queryTransform: {
                                removeParams: simpleParams
                            }
                        }
                    }
                },
                condition: {
                    resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest", "ping", "image", "other"],
                    ...filter
                }
            });
        }
    }

    return rules;
}
