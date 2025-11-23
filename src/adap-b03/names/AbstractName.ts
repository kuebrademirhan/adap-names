import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    //Used in both classes
    protected static escapeComponent(component: string, delimiter: string): string {
        // Escape the escape char itself first
        const escapedEscapeChar = ESCAPE_CHARACTER.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const escapeRegex = new RegExp(escapedEscapeChar, 'g');
        // Escape the delimiter
        const escapedDelimiter = delimiter.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const delimiterRegex = new RegExp(escapedDelimiter, 'g');

        return component
            .replace(escapeRegex, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replace(delimiterRegex, ESCAPE_CHARACTER + delimiter);
    }

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public clone(): Name {
        return Object.create(this);
    }

    public asString(delimiter: string = this.delimiter): string {
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(AbstractName.escapeComponent(this.getComponent(i), delimiter));
        }
        return components.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        return this.asString(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if (!(other instanceof AbstractName)) {
            return false;
        }

        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }

        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
             return false;
        }

        for (let i = 0; i < this.getNoComponents(); i++) {
            // Relies on abstract getComponent()
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        let hash = 0;
        const str = this.asDataString();
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) - char;
            hash |= 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            
            const rawComponent = other.getComponent(i);
            this.append(rawComponent);
        }
        }

}