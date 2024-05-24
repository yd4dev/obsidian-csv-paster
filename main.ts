import { MarkdownView, Plugin } from "obsidian";

export default class CsvPasterPlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: "paste-csv",
            name: "Paste CSV from Clipboard into Table",
            checkCallback: (checking: boolean) => {
                // Conditions to check
                const markdownView =
                    this.app.workspace.getActiveViewOfType(MarkdownView);
                if (markdownView) {
                    // If checking is true, we're simply "checking" if the command can be run.
                    // If checking is false, then we want to actually perform the operation.
                    if (!checking) {
                        navigator.clipboard.readText().then((result) => {
                            markdownView.editor.replaceRange(
                                "\n" + csvToTable(result),
                                markdownView.editor.getCursor(),
                            );
                        });
                    }
                    // This command will only show up in Command Palette when the check function returns true
                    return true;
                }
            },
        });

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.
        this.registerDomEvent(document, "click", (evt: MouseEvent) => {
            console.log("click", evt);
        });

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        this.registerInterval(
            window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000),
        );
    }

    onunload() {}
}

function csvToTable(input: string): string {
    const rows = input.split("\n");
    let result = "|";
    const rowCount = rows[0].split(",").length;
    result +=
        rows[0].replace(/,/g, "|") + "|\n" + "|---".repeat(rowCount) + "|";

    for (let i = 1; i < rows.length - 1; i++) {
        result += "\n|" + rows[i].replace(/,/g, "|") + "|";
    }
    return result;
}
