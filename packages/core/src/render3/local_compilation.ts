
import type {Type} from '../interface/type';
import type {NgModuleType} from '../metadata/ng_module_def';
import type {ComponentType, DependencyTypeList} from './interfaces/definition';
import {transitiveScopesFor, transitiveScopesForNgModule} from './jit/module';
import {getComponentDef, getNgModuleDef, isStandalone} from './definition';
import {isNgModule} from './jit/util';

const DEBUG = true;
const log = DEBUG ? (...args: any[]) => console.log('>>>>> DEBUG: ', ...args) : () => {};

export function ɵɵmakeRuntimeResolverFn(comp: Type<any>, imports: Type<any>[]): () =>
    DependencyTypeList {
  return () => {
    log('Inner ɵɵmakeRuntimeResolverFn called!', comp);

    const def = getComponentDef(comp);
    if (!def) return [];

    const moduleImports = def.standalone ? imports : def.moduleImports;
    if (!moduleImports) return [];

    const deps: Type<any>[] = [];

    for (const t of moduleImports) {
      const scope = transitiveScopesFor(t);
      deps.push(...scope.exported.directives, ...scope.exported.pipes);
    }

    log('ɵɵmakeRuntimeResolverFn: deps emited:', deps);

    return deps;
  }
}

export function ɵɵsetDeclarationsScope(moduleType: NgModuleType<any>): void {
  log('ɵɵsetDeclarationsScope called for module', moduleType);

  const def = getNgModuleDef(moduleType);
  if (!def) return;

  const imports: Type<any>[] = (typeof def.imports === 'function') ? def.imports() : def.imports;

  const scopes: Type<any>[] = imports.filter(decl => isNgModule(decl) || isStandalone(decl));

  log('ɵɵsetDeclarationsScope: Scopes to be hoisted:', scopes);

  const declarations: Type<any>[] =
      (typeof def.declarations === 'function') ? def.declarations() : def.declarations;

  for (const decl of declarations) {
    const def = getComponentDef(decl);
    if (def) {
      def.moduleImports = scopes;
    }
  }
}
