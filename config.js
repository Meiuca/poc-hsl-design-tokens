function getStyleDictionaryConfig({ brand, theme, platform, source, buildPath }) {

  console.log({ brand, theme, platform, source, buildPath });

  let files = !theme ?
    {
        "destination": `${brand}.scss`,
        "format": "scss/variables"
    }:
    {
        "destination": `${theme}.scss`,
        "format": "scss/variables"
    };

  return {
    "source": source,
    "platforms": {
        "web/scss": {
            "transformGroup": "tokens-scss",
            "buildPath": buildPath.web,
            "files": [files]
        },
        // there are different possible formats for iOS (JSON, PLIST, etc.) so you will have to agree with the iOS devs which format they prefer
        "ios": {
            // I have used custom formats for iOS but keep in mind that Style Dictionary offers some default formats/templates for iOS,
            // so have a look at the documentation before creating custom templates/formats, maybe they already work for you :)
            "transformGroup": "tokens-ios",
            "buildPath": buildPath.ios,
            "files": [
                {
                    "destination": "tokens-all.plist",
                    "format": "ios/plist",
                    "filter": "notIsColor"
                },
                {
                    "destination": "tokens-colors.plist",
                    "format": "ios/plist",
                    "filter": "isColor"
                }
            ]
        },
        "android": {
            // I have used custom formats for Android but keep in mind that Style Dictionary offers some default formats/templates for Android,
            // so have a look at the documentation before creating custom templates/formats, maybe they already work for you :)
            "transformGroup": "tokens-android",
            "buildPath": buildPath.android,
            "files": [
                {
                    "destination": "tokens-all.xml",
                    "format": "android/xml",
                    "filter": "notIsColor"
                },
                {
                    "destination": "tokens-colors.xml",
                    "format": "android/xml",
                    "filter": "isColor"
                }
            ]
        }
    }
  };
}

module.exports = {
  getStyleDictionaryConfig
}