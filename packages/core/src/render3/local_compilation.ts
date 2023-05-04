import type {Type} from '../interface/type';
import type {NgModuleType} from '../metadata/ng_module_def';
import type {DependencyTypeList} from './interfaces/definition';
import {transitiveScopesFor} from './jit/module';
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

    let deps: Type<any>[] = [];

    if (def.standalone) {  // Standalone
      for (const t of imports) {
        if (isNgModule(t) || isStandalone(t)) {
          const scope = transitiveScopesFor(t);
          deps.push(t, ...scope.exported.directives, ...scope.exported.pipes);
        }
      }
    } else {  // Module associated
      if (def.parentModule) {
        const scope = transitiveScopesFor(def.parentModule);
        deps.push(def.parentModule, ...scope.compilation.directives, ...scope.compilation.pipes);
      }
    }

    deps = [...new Set(deps)].filter(e => e !== comp);

    log('ɵɵmakeRuntimeResolverFn: deps emited:', deps);

    return deps;
  }
}

export function ɵɵsetDeclarationsScope(moduleType: NgModuleType<any>): void {
  log('ɵɵsetDeclarationsScope called for module', moduleType);

  const def = getNgModuleDef(moduleType);
  if (!def) return;

  const declarations: Type<any>[] =
      (typeof def.declarations === 'function') ? def.declarations() : def.declarations;

  for (const decl of declarations) {
    const def = getComponentDef(decl);
    if (def) {
      def.parentModule = moduleType;
    }
  }
}
