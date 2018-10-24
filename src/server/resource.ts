import 'reflect-metadata';
import {NextFunction, Request, Response} from "express";


// Decorators
export const Resource = resource;
export const Route = route;

const RESOURCE_ROUTES_META_KEY = 'RESOURCE_ROUTES_META_KEY';

export type HandlerFn = (req?: Request, res?: Response, done?: NextFunction) => Promise<any>;

export interface RouteDef {
    method: string,
    path: string,
    handler: HandlerFn
}

export abstract class ResourceBase {

    private namespace: string = '';

    constructor() { }

    public getRoutes(): Array<RouteDef> {
        const metadata = Reflect.getMetadata(RESOURCE_ROUTES_META_KEY, this.constructor) || {};
        // console.log(metadata);
        return Object.keys(metadata).map((key) => {
            let { path, method, handler } = metadata[key];
            if (this.namespace) {
                path = this.namespace + path;
            }
            handler = handler.bind(this);
            return { path, method, handler }
        })
    }
}

export function getResources() {
    return resources;
}

function route(path: string, method = 'get') {
    method = method.toLowerCase();
    // console.log("route factory", method, path);
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {

        const originalMethod = descriptor.value;

        // do something with 'target' and 'value'...
        // console.log(target); // <- Class definition
        var classConstructor = target.constructor;
        // console.log('property target: ' , classConstructor);

        const metadata = Reflect.getMetadata(RESOURCE_ROUTES_META_KEY, classConstructor) || {};
        metadata[propertyKey] = { path, method, handler: descriptor.value };
        Reflect.defineMetadata(RESOURCE_ROUTES_META_KEY, metadata, classConstructor);


        // console.log(propertyKey);
        // console.log(descriptor);

        //descriptor;
        descriptor.value = descriptor.value.bind(classConstructor);

        return descriptor;
    }
}

const resources: Array<any> = [];

function resource(namespace = ''): ClassDecorator {
    return <ClassDecorator> function (target: any) {
        // save a reference to the original constructor
        const original = target;

        const f = function (...args: any[]) {
            // console.log("New: " + original.name);
            const instance = new original(...args);
            instance.namespace = namespace;
            return instance;
        };

        // copy prototype so intanceof operator still works
        f.prototype = original.prototype;
        (<any> f)._name = original.name;

        resources.push(original);

        return f;
    }
}


/*
//-----
@Resource('resource')
export class A extends ResourceBase {
    @Route('/test', 'GET')
    someMethod() {
        return Promise.resolve('hello');
    }
}
/*
console.log('call create');
const a = new A();
console.log(a);
console.log('call method');
a.someMethod();

console.log(a instanceof A);

// Class decor for all methods
// https://stackoverflow.com/questions/47621364/js-ts-apply-decorator-to-all-methods-enumerate-class-methods
function log(target: Function) {
    console.log(target);
    for (const propertyName of Object.keys(target.prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
        const isMethod = descriptor.value instanceof Function;
        console.log('--');
        console.log(descriptor);
        if (!isMethod)
            continue;

        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            console.log("The method args are: " + JSON.stringify(args));
            const result = originalMethod.apply(this, args);
            console.log("The return value is: " + result);
            return result;
        };

        Object.defineProperty(target.prototype, propertyName, descriptor);
    }
}

// const a = new A();
console.log('xxxxxxxxxxxxxx');
console.log(a.getRoutes());


console.log('xxx');
console.log(getResources());
console.log('xxxxxx');
getResources().forEach((clazz: any) => {
    const a = new clazz() as ResourceBase;
    console.log(clazz.name);
    console.log(a.getRoutes());
});*/