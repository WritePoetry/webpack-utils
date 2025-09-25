// Dependencies.
const path = require( 'path' );
const { globSync } = require( 'glob' );

/**
 * Processes individual block stylesheets for a specific block namespace. These
 * are not imported into the primary stylesheets and are enqueued separately.
 *
 * @since  1.0.0
 * @param {string} srcDirectory		The folder to search (e.g., 'blocks', 'plugins').
 * @param {string} extension		The file extension to process (e.g., 'scss', 'js').
 * @param {string} [distDirectory]	The output folder (e.g., 'css', 'js'). Defaults to the source folder.
 * @return {Object.<string, string>}
 */
const blockAssets = ( srcDirectory, extension, distDirectory ) => {
	return globSync( `./resources/${extension}/${ srcDirectory }/**/*.${extension}` ).reduce(
		( files, filepath ) => {
			const relativePath = path.relative(
				`./resources/${extension}/${ srcDirectory }`,
				filepath
			);
			const namespace = path.dirname( relativePath );
			const name = path.parse( filepath ).name;
			
			// If outputFolder is not specified, use the source folder (`extension`).
			const finalOutputFolder = distDirectory || extension;

			files[ `${finalOutputFolder}/${ srcDirectory }/${ namespace }/${ name }` ] = path.resolve(
				process.cwd(),
				`resources/${extension}/${ srcDirectory }/${ namespace }`,
				`${ name }.${extension}`
			);

			return files;
		},
		{}
	);
};


module.exports = {
    blockAssets,
    // future utils go here, e.g.:
    // anotherHelper,
};