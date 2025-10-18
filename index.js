// Dependencies.
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const { getWebpackEntryPoints, getProjectSourcePath } = require( '@wordpress/scripts/utils/config' );
const path = require( 'path' );
const fs = require( 'fs' );
const { globSync } = require( 'glob' );

const projectSourcePath = getProjectSourcePath();

/**
 * Finds the value of `--output-path` among the process arguments,
 * if present. Returns `null` if not found.
 */
function getOutputPathFromArgs() {
	const argPrefix = '--output-path=';
	for ( const arg of process.argv ) {
		if ( arg.startsWith( argPrefix ) ) {
			return arg.slice( argPrefix.length );
		}
	}
	return null;
};

/**
 * Processes individual block stylesheets for a specific block namespace. These
 * are not imported into the primary stylesheets and are enqueued separately.
 *
 * @return {Object.<string, string>}
 */
const getAllAssets = ( options = {} ) => {
	const userExcludes = options.excludeDirs || [];
    const excludeDirs = [ 'blocks', ...userExcludes ]; 
	const remapDirs = options.remapDirs || {};

	const subDirs = fs.readdirSync( projectSourcePath )
		.map( name => ({ 
			name, 
			fullPath: path.join( projectSourcePath, name ) 
		} ) )
		.filter( dir => fs.statSync( dir.fullPath ).isDirectory() )
		.filter( dir =>  ! excludeDirs.includes( dir.name )  && ! dir.name.startsWith( '_' ) );

		
	const allFiles = {};
	for ( const dir of subDirs ) {
		Object.assign( allFiles, getAsset( dir.fullPath, { remapDirs } ) );
	}

	return allFiles;
};

/**
 * Processes individual block stylesheets for a specific block namespace. These
 * are not imported into the primary stylesheets and are enqueued separately.
 *
 * @param  {string} dir
 * @return {Object.<string, string>}
 */
const getAsset = ( dir,  { remapDirs = {} } = {} ) => {
	const pattern = path.join( dir, '**', '*.*' );

	return globSync( pattern ).reduce(
		( files, filepath ) => { 
			const strippedPath = path.relative(
				projectSourcePath,
				filepath
			);

			const ext = path.parse( strippedPath ).ext;
			const filename = path.basename( filepath );


			// Skip files that start with underscore.
			if ( filename.startsWith( '_' ) ) {
				return files;
			}

			const allowed = [ '.js', '.ts', '.jsx', '.tsx', '.scss', '.css' ];
			if ( ! allowed.includes( ext ) ) {
				return files; // skip
			}
			
			// Default chunk name.
			let entryChunkName = strippedPath.slice( 0, -ext.length );

			// Apply remapping if path matches.
			for ( const [ from, to ] of Object.entries( remapDirs ) ) {
				if ( entryChunkName.startsWith( from ) ) {
					entryChunkName = entryChunkName.replace( from, to );
					break;
				}
			}
		
			const entryFile = path.resolve(
				projectSourcePath,
				strippedPath
			);

			files[ entryChunkName ] = entryFile;

			return files;
		}, {}
	);
};

module.exports = {
    getAllAssets,
	getAsset,
    // future utils go here, e.g.:
    // anotherHelper,
};