const StyleDictionaryPackage = require('style-dictionary');
const _ = require('lodash');
const fs = require('fs');
const utils = require('./utils');
const { getStyleDictionaryConfig } = require('./config');

const PLATFORMS = ['web', 'ios', 'android'];
const BRANDS = [{ brand: "globals", theme: null }];

utils.getDirectories("/properties/brands").map(brand => {
  utils.getDirectories(`/properties/brands/${brand}`).map(theme => {
    BRANDS.push({
      brand: brand,
      theme: theme
    });
  });
});


// REGISTER CUSTOM FORMATS + TEMPLATES + TRANSFORMS + TRANSFORM GROUPS

// if you want to see the available pre-defined formats, transforms and transform groups uncomment this
// console.log(StyleDictionaryPackage);

StyleDictionaryPackage.registerFormat({
  name: 'json/flat',
  formatter: function(dictionary) {
      return JSON.stringify(dictionary.allProperties, null, 2);
  }
});

StyleDictionaryPackage.registerFormat({
  name: 'ios/plist',
  formatter: _.template( fs.readFileSync(__dirname + '/templates/ios-plist.template'))
});

StyleDictionaryPackage.registerFormat({
  name: 'android/xml',
  formatter: _.template( fs.readFileSync(__dirname + '/templates/android-xml.template'))
});

StyleDictionaryPackage.registerFormat({
  name: 'android/colors',
  formatter: _.template( fs.readFileSync(__dirname + '/templates/android-xml.template'))
});

StyleDictionaryPackage.registerTransform({
  name: 'size/pxToPt',
  type: 'value',
  matcher: function(prop) {
      return prop.value.toString().match(/^[\d.]+px$/);
  },
  transformer: function(prop) {
      return prop.value.toString().replace(/px$/, 'pt');
  }
});

StyleDictionaryPackage.registerTransform({
  name: 'size/pxToDp',
  type: 'value',
  matcher: function(prop) {
      return prop.value.toString().match(/^[\d.]+px$/);
  },
  transformer: function(prop) {
      return prop.value.toString().replace(/px$/, 'dp');
  }
});

StyleDictionaryPackage.registerTransformGroup({
  name: 'tokens-scss',
  // to see the pre-defined "scss" transformation use: console.log(StyleDictionaryPackage.transformGroup['scss']);
  transforms: [ "name/cti/kebab", "time/seconds", "size/px", "color/css" ]
});

StyleDictionaryPackage.registerTransformGroup({
  name: 'tokens-ios',
  // to see the pre-defined "ios" transformation use: console.log(StyleDictionaryPackage.transformGroup['ios']);
  transforms: [ "attribute/cti", "name/cti/camel", "size/pxToPt"]
});

StyleDictionaryPackage.registerTransformGroup({
  name: 'tokens-android',
  // to see the pre-defined "android" transformation use: console.log(StyleDictionaryPackage.transformGroup['android']);
  transforms: [ "attribute/cti", "name/cti/camel", "size/pxToDp"]
});

StyleDictionaryPackage.transformGroup['android'];

console.log('Build started...');


console.log(BRANDS);

console.log('\nBuild completed!');

PLATFORMS.map(function(platform) {
  //OS VALORES DOS INDICES DO ARRAY SÃO REFERENTES AS PASTAS DE CADA MARCA
  BRANDS.map(async function(current) {


    StyleDictionaryPackage.registerFilter({
      name: 'notIsColor',
      matcher: function(prop) {
          return prop.attributes.category !== 'color';
      }
    });

    StyleDictionaryPackage.registerFilter({
      name: 'isColor',
      matcher: function(prop) {
          return prop.attributes.category === 'color';
      }
    });

    let themePath = current.theme ? `${current.theme}/` : '';
    let brandSourcePath = current.brand !== 'globals' ? 'brands/' : '';
    let source = `properties/${brandSourcePath}${current.brand}/${themePath}**/*.json`;

    let brandPath = current.brand !== 'globals' ? `${current.brand}/` : '';
    let buildPath = {
      web: `dist/web/${brandPath}`,
      ios: `dist/ios/${brandPath}`,
      android: `dist/android/${brandPath}`
    };

    await buildTokens({current, platform, buildPath, source});

  });
});


async function buildTokens({current, platform, buildPath, source}){

  // console.log('\n==============================================');
  // console.log(`\nProcessing: [${platform}] [${current.brand}]`);

  const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig({
      brand: current.brand,
      platform: platform,
      buildPath: buildPath,
      theme: current.theme,
      source: [source]
  }));

  if (platform === 'web') {
      await StyleDictionary.buildPlatform('web/scss');
  } else if (platform === 'ios') {
      await StyleDictionary.buildPlatform('ios');
  } else if (platform === 'android') {
      await StyleDictionary.buildPlatform('android');
  }

  // console.log('\nEnd processing');
  // console.log('\n==============================================');
}


// globals.css
// bb/default.css
// bb/black-friday.css
// cef/default.css
// cef/outubro-rosa


