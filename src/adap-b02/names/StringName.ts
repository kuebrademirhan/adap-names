import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name= source;
        this.delimiter= delimiter ?? DEFAULT_DELIMITER;
        this.noComponents= this.parseName(this.name, this.delimiter).length;
    }

    public parseName(nameString: string, delimeter : string) : string[] {
        const components :string[] = [];
        var currentComponent = "";
        var isEscaped= false;
        
        if(nameString.length===0){
            return components;
        }

        for( var i=0 ; i <nameString.length; i++){
            const c = nameString.charAt(i);
            if(isEscaped){
                currentComponent+=c;
                isEscaped=false;
            }else if(c===ESCAPE_CHARACTER){
                isEscaped=true;
            }else if(c===delimeter){
                components.push(currentComponent);
                currentComponent="";
            }else{
                currentComponent+=c;
            }

        }
        components.push(currentComponent);
        return components;

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

    /**
     * Rebuilds the internal name string from an array of components.
     */
    private rebuildName(components: string[]): void {
        this.name = components
            .map(c => this.escapeComponent(c, this.delimiter))
            .join(this.delimiter);
        this.noComponents = components.length;
    }

    public asString(delimiter: string = this.delimiter): string {
        if (delimiter === this.delimiter) {
            return this.name;
        }
        // If delimiter is different, we must re-parse and re-escape
        const components = this.parseName(this.name, this.delimiter);
        return components
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
        return this.noComponents===0 ;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        const components = this.parseName(this.name, this.delimiter);
        if (x < 0 || x >= components.length) {
            throw new Error(`Component index ${x} is out of bounds (0..${components.length - 1})`);
        }
        return components[x];
    }

    public setComponent(n: number, c: string): void {
        const components = this.parseName(this.name, this.delimiter);
        if (n < 0 || n >= components.length) {
            throw new Error(`Component index ${n} is out of bounds (0..${components.length - 1})`);
        }
        components[n] = c;
        this.rebuildName(components);
    }

    public insert(n: number, c: string): void {
        const components = this.parseName(this.name, this.delimiter);
        if (n < 0 || n > components.length) {
            throw new Error(`Insert index ${n} is out of bounds (0..${components.length})`);
        }
        components.splice(n, 0, c);
        this.rebuildName(components);
    }

    public append(c: string): void {
        const newComponentEscaped = this.escapeComponent(c, this.delimiter);
        if (this.noComponents === 0) {
            this.name = newComponentEscaped;
        } else {
            this.name += this.delimiter + newComponentEscaped;
        }
        this.noComponents++;
    }

    public remove(n: number): void {
       const components = this.parseName(this.name, this.delimiter);
        if (n < 0 || n >= components.length) {
            throw new Error(`Component index ${n} is out of bounds (0..${components.length - 1})`);
        }
        components.splice(n, 1);
        this.rebuildName(components);
    }

    public concat(other: Name): void {
        const otherNameString = other.asString(this.delimiter);
        
        if (this.noComponents === 0) {
            this.name = otherNameString;
        } else if (other.getNoComponents() > 0) {
            this.name += this.delimiter + otherNameString;
        }     
        this.noComponents += other.getNoComponents();
    }

}