import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName implements Name {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter); // Call super constructor
        this.name= source;
        this.noComponents= this.parseName(this.name, this.delimiter).length;
    }

    // Kept: parseName is essential for StringName internal logic
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

    /**
     * Rebuilds the internal name string from an array of raw components.
     */
    private rebuildName(components: string[]): void {
        // Uses the inherited static helper for escaping
        this.name = components
            .map(c => AbstractName.escapeComponent(c, this.delimiter))
            .join(this.delimiter);
        this.noComponents = components.length;
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
        
        const newComponentEscaped = AbstractName.escapeComponent(c, this.delimiter);
        
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
        // Optimized: uses other.asString to get the fully escaped string for this Name's delimiter
        const otherNameString = other.asString(this.delimiter);
        
        if (this.noComponents === 0) {
            this.name = otherNameString;
        } else if (other.getNoComponents() > 0) {
            this.name += this.delimiter + otherNameString;
        }     
        this.noComponents += other.getNoComponents();
    }
    
   

    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

  
    // Overrides AbstractName.asString for the case where delimiter hasn't changed.
    public asString(delimiter: string = this.delimiter): string {
        if (delimiter === this.delimiter) {
            return this.name; 
        }
        // Fallback to AbstractName's comprehensive logic
        return super.asString(delimiter);
    }
}