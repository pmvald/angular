
import type {Type} from '../interface/type';
import type {NgModuleType} from '../metadata/ng_module_def';
import {flatten} from '../util/array_utils';
import type {ComponentType, DependencyTypeList} from './interfaces/definition';
import {transitiveScopesFor, transitiveScopesForNgModule} from './jit/module';
import {getComponentDef, ɵɵsetComponentScope} from './definition';

export function ɵɵmakeRuntimeResolverFn(importedTypes: Type<any>[]): () => DependencyTypeList {
  /**return () => {
    const list: DependencyTypeList = [];
    for (const imported of importedTypes) {
      const scope = transitiveScopesFor(imported);
      list.push(...scope.exported.directives, ...scope.exported.pipes);
    }
    return list;
  };**/

  console.log('HIIIIII!!!!!');

  return () => ([]);
}