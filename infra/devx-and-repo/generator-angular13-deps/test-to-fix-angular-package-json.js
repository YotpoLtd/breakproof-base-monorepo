const { createExportableManifest } = require('@pnpm/exportable-manifest');
const path = require('node:path');

const targetPackageJson = require(path.join(__dirname, '../lint/package.json'));

/**
 * Works on the assumption that the package.json has a `publishConfig` property
 * like:
 *
 * 	"publishConfig": {
 * 		"packageJsonPropsToRemove": ["dependencies"]
 * 	},
 */
const PROPS_TO_DELETE_FROM_PUBLISHED_PACKAGE_JSON = [
  'publishConfig',
  ...(targetPackageJson.publishConfig?.packageJsonPropsToRemove || []),
];

const c = async () => {
  // eslint-disable-next-line no-console -- Work in progress
  console.log('Cleaning up final package.json');
  // eslint-disable-next-line no-console -- Work in progress
  console.log(
    await createExportableManifest(
      path.join(__dirname, '../lint'),
      targetPackageJson,
    ),
  );
};

PROPS_TO_DELETE_FROM_PUBLISHED_PACKAGE_JSON.forEach((prop) => {
  delete targetPackageJson[prop];
});

c();
