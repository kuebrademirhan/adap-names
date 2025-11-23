import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName implements Name {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
       super(delimiter); // Call super constructor
       this.components = [...source];
    }

    // --- AbstractName Implementations (Minimal Interface) ---

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
            // Retrieve raw component from other Name
            this.components.push(other.getComponent(i));
        }
    }

   

    public clone(): Name {
        return new StringArrayName(this.components, this.delimiter); 
    }
}