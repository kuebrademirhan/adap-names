import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
       this.delimiter = delimiter ?? DEFAULT_DELIMITER;
       this.components = [...source]; // Use a copy
    }

    
    //Escapes a single component string.   
    private escapeComponent(component: string, delimiter: string): string {
        // Escape the escape char itself first
        const escapeRegex = new RegExp(ESCAPE_CHARACTER.replace(/\\/g, '\\\\'), 'g');
        // Escape the delimiter
        const delimiterRegex = new RegExp(delimiter.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');

        return component
            .replace(escapeRegex, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replace(delimiterRegex, ESCAPE_CHARACTER + delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components
            .map(c => this.escapeComponent(c, delimiter))
            .join(delimiter);
    }

    public asDataString(): string {
        return this.asString(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;       
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new Error(`Index is out of bounds`);
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
       if (i < 0 || i >= this.components.length) {
            throw new Error(`Index is out of bounds`);
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error(`Index is out of bounds`);
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error(`Index is out of bounds`);
        }
        this.components.splice(i,1);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

}