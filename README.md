## **Important Notice**

**This fork is Chrome Manifest V3 (MV3) compatible only.** This version has been fully migrated to Manifest V3 and is optimized specifically for Chrome and Chromium-based browsers that support MV3. Manifest V2 is not supported in this fork.

Make sure you are using a Chrome/Chromium browser version that supports MV3 (Chrome 88+) before installing or building this extension.

### ⚠️ Test Page Compatibility Notice

**The official test page ([test.clearurls.xyz](https://test.clearurls.xyz/)) may show errors even when this extension is working correctly.** This is because the test page was designed for the older `webRequest` API (Manifest V2), which is no longer available in Manifest V3 for Chrome/Chromium browsers.

This fork uses Chrome's modern `declarativeNetRequest` API, which works differently but provides the same privacy protection. To verify the extension is working, test with real URLs like `https://example.com/?utm_source=test&fbclid=123` - the tracking parameters should be automatically removed.

If you experience issues, please [open an issue](https://github.com/ecuware/ClearURLS-Chrome/issues/new) with your browser version and the URL that isn't being cleaned.

---

<a href="https://www.paypal.me/KevinRoebert" target="_blank"><img src="https://raw.githubusercontent.com/KevinRoebert/DonateButtons/master/Paypal.png" alt="Buy Me A Coffee" height="55"></a>
<a href="https://www.buymeacoffee.com/KevinRoebert" target="_blank"><img src="https://raw.githubusercontent.com/KevinRoebert/DonateButtons/master/BuyMeACoffee.png" alt="Buy Me A Coffee" height="55"></a>

[<img src="https://blog.mozilla.org/addons/files/2020/04/get-the-addon-fx-apr-2020.svg" alt="for Firefox" height="60px">](https://addons.mozilla.org/firefox/addon/clearurls/) [<img src="https://docs.clearurls.xyz/1.22.0/assets/img/MEA-button.png" alt="for Edge" height="60px">](https://microsoftedge.microsoft.com/addons/detail/mdkdmaickkfdekbjdoojfalpbkgaddei)

# <sub><img src="https://gitlab.com/ClearURLs/ClearUrls/raw/master/img/clearurls.svg" width="64px" height="64px"></sub> ClearURLs

**ClearURLs** is a browser extension that automatically removes tracking elements from URLs to help protect your privacy when browsing the Internet.

This fork is optimized for **Chrome and Chromium-based browsers** using **Manifest V3**.

The tracking rules database is regularly updated and can be found [here](https://gitlab.com/anti-tracking/ClearURLs/rules/-/raw/master/data.min.json).

## How It Works

Many websites use tracking elements in URLs to monitor your online activity. For example:
```
https://example.com?utm_source=newsletter1&utm_medium=email&utm_campaign=sale
```

These tracking parameters are not necessary for websites to function correctly and can be safely removed—that's exactly what ClearURLs does automatically.

### Example: Amazon URLs

Amazon URLs often contain extensive tracking code. Before cleaning:
```
https://www.amazon.com/dp/exampleProduct/ref=sxin_0_pb?__mk_de_DE=ÅMÅŽÕÑ&keywords=tea&pd_rd_i=exampleProduct&pd_rd_r=8d39e4cd-1e4f-43db-b6e7-72e969a84aa5&pd_rd_w=1pcKM&pd_rd_wg=hYrNl&pf_rd_p=50bbfd25-5ef7-41a2-68d6-74d854b30e30&pf_rd_r=0GMWD0YYKA7XFGX55ADP&qid=1517757263&rnid=2914120011
```

After ClearURLs cleans it:
```
https://www.amazon.com/dp/exampleProduct
```

## Features

- ✅ **Automatic URL cleaning** - Removes tracking elements from URLs in the background
- ✅ **Ad domain blocking** - Optionally blocks common ad domains
- ✅ **Bulk URL cleaning tool** - Clean multiple URLs at once with the built-in tool
- ✅ **Direct redirection** - Redirects to destinations without tracking services as middlemen
- ✅ **Context menu integration** - Quick access to copy clean links via right-click menu
- ✅ **Hyperlink auditing protection** - Blocks ping tracking (see [specification](https://html.spec.whatwg.org/multipage/links.html#hyperlink-auditing))
- ✅ **ETag tracking prevention** - Prevents ETag-based tracking
- ✅ **History API protection** - Prevents tracking injection via history API (see [replaceState() method](https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_replaceState()_method))
- ✅ **Search engine protection** - Prevents Google and Yandex from rewriting search results with tracking elements

## Permissions

For detailed information about required permissions and why they are needed, please see [this documentation](https://gitlab.com/ClearURLs/ClearUrls/issues/159).

## Screenshot

![Interface (version 1.14.0)](https://docs.clearurls.xyz/1.22.0/assets/img/interface.png)

## Installation

### Chrome/Chromium

This fork is designed for Chrome and Chromium-based browsers (Manifest V3). You can build the extension from source or download pre-built artifacts.

**CI/CD Artifacts:**
- [ClearURLs.zip](https://gitlab.com/ClearURLs/ClearUrls/-/jobs/artifacts/master/raw/ClearURLs.zip?job=bundle%20addon)

## Testing

To verify that ClearURLs is working correctly, try these real-world tests:

1. **Test with tracking parameters:**
   - Visit: `https://example.com/?utm_source=test&utm_medium=email&fbclid=123456`
   - The URL should automatically clean to: `https://example.com/`

2. **Test with Google search results:**
   - Perform a Google search and click on any result
   - The tracking parameters should be removed automatically

3. **Check the extension popup:**
   - Click the ClearURLs icon in your browser toolbar
   - You should see statistics showing blocked tracking elements

**Note:** The official test page at [test.clearurls.xyz](https://test.clearurls.xyz/) may show errors due to Manifest V3 API differences (see notice at the top of this README).

## Contributing

We welcome contributions! If you have suggestions or encounter issues, please [create an issue](https://gitlab.com/ClearURLs/ClearUrls/issues/new).

**Note:** For suggestions or issues regarding the tracking rules database, please [create an issue in the rules repository](https://gitlab.com/anti-tracking/ClearURLs/rules/-/issues/new) or email us at rules.support (at) clearurls.xyz (this will automatically create a new issue in the rules repo).

### Translation

Help translate ClearURLs into more languages! You can contribute translations in two ways:

#### Option 1: Merge Request

1. Open [`_locales/en/messages.json`](https://gitlab.com/ClearURLs/ClearUrls/-/blob/master/_locales/en/messages.json)
2. Translate the English terms into your language
3. Create a pull request with your translation
4. Place your translation file in `_locales/{language code}/messages.json`

**Note:** The description field in translation files is informational only and does not need to be translated (it's usually empty).

#### Option 2: POEditor

[<img src="https://poeditor.com/public/images/logo/logo.svg" alt="POEditor" width="150">](https://poeditor.com/join/project/vKTpQWWvk2)

## Projects Using ClearURLs

The following projects use parts of ClearURLs:

- **[Uroute](https://github.com/walterl/uroute)** - Filters/cleans URLs before launching browser
- **[Scrub](https://gitlab.com/CrunchBangDev/cbd-cogs/-/tree/master/Scrub)** - Red Discord bot cog for filtering/cleaning URLs
- **[Unalix](https://github.com/AmanoTeam/Unalix)** - Small, dependency-free, fast Python package for removing tracking fields from URLs
- **[Unalix-nim](https://github.com/AmanoTeam/Unalix-nim)** - Small, dependency-free, fast Nim package and CLI tool for removing tracking fields from URLs
- **[UnalixAndroid](https://github.com/AmanoTeam/UnalixAndroid)** - Simple Android app that removes link masking/tracking and optionally resolves shortened links
- **[pl-fe](https://github.com/mkljczk/pl-fe)** - Fediverse client that uses ClearURLs code to clean URLs from displayed posts

## Recommended By

- [ghacks-user.js](https://github.com/ghacksuserjs/ghacks-user.js/wiki/4.1-Extensions)
- [Awesome Humane Tech List](https://github.com/humanetech-community/awesome-humane-tech#tracking)
- [PrivacyTools](https://www.privacytools.io/browsers/#addons)
- [New York Times Wirecutter](https://www.nytimes.com/wirecutter/reviews/our-favorite-ad-blockers-and-browser-extensions-to-protect-privacy/#cleaner-links-clearurls)
- ClearURLs is part of Mozilla's recommended extensions program

## Additional Information

For detailed information about permissions and why they are needed, see [this documentation page](https://docs.clearurls.xyz/latest/permissions/).

## Third-Party Libraries

This extension uses the following third-party libraries:

| Library | Copyright | License |
|---------|-----------|---------|
| [WebExtension browser API Polyfill](https://github.com/mozilla/webextension-polyfill) | Mozilla | [MPL-2.0](https://github.com/mozilla/webextension-polyfill/blob/master/LICENSE) |
| [Bootstrap](https://github.com/twbs/bootstrap) | Twitter, Inc. (2011-2016) | [MIT](https://github.com/twbs/bootstrap/blob/master/LICENSE) |
| [jQuery](https://github.com/jquery/jquery/) | JS Foundation and contributors | [MIT](https://jquery.org/license/) |
| [DataTables](https://github.com/DataTables/DataTables/tree/master) | SpryMedia Limited (2008-2015) | [MIT](https://datatables.net/license/) |
| [Pickr](https://github.com/Simonwep/pickr/) | Simon Reinisch (2018-2020) | [MIT](https://github.com/Simonwep/pickr/blob/master/LICENSE) |
| [Font Awesome](https://github.com/FortAwesome/Font-Awesome/) | @fontawesome | [Font Awesome Free License](https://github.com/FortAwesome/Font-Awesome/blob/master/LICENSE.txt) |


## Star History

 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=ClearURLs/Addon&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=ClearURLs/Addon&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=ClearURLs/Addon&type=Date" />
 </picture>