let fromDirPath: string | undefined;
let toDirPath: string | undefined;

Deno.args.forEach((arg, index) => {
    switch (arg) {
        case "--from":
            fromDirPath = Deno.args[index + 1];
            break;
        case "--to":
            toDirPath = Deno.args[index + 1];
            break;
    }
})

if (fromDirPath && toDirPath) {
    const input = prompt(`Source folder: '${fromDirPath}'\nDestination folder: '${toDirPath}/<size>/<filename>'\nContinue? (yes|no)`, 'yes');

    if (input == 'yes') {
        for await (const dirEntry of Deno.readDir(toDirPath)) {
            await Deno.remove(`${toDirPath}/${dirEntry.name}`, {recursive: true});
        }
        
        for await (const dirEntry of Deno.readDir(fromDirPath)) {
            const match = dirEntry.name.match(/(^[a-zA-Z-]+)-([0-9]+)\.([a-zA-Z]+)$/) || []
            const icon = {
                file: match[0],
                name: match[1],
                size: match[2],
                extension: match[3]
            }
            const fromPath = `${fromDirPath}/${icon.file}`
            const toPath = `${toDirPath}/${icon.size}/${icon.name}.${icon.extension}`
        
            await Deno.mkdir(`${toDirPath}/${icon.size}`, {recursive: true})
            await Deno.copyFile(fromPath, toPath)
            console.log(`Copy file '${icon.file}' from '${fromPath}' to '${toPath}'.`);
        }
    }   
} else {
    console.log(`Please provide valid '--from <source>' and '--to <destination>'`);
}
