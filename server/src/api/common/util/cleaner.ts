export class Cleaner {
  static clean(obj: any): any {
    delete obj.__typename;
    Object.keys(obj).forEach(k => {
      if (k === 'id') {
        // Translate from GraphQL ID strings to numbers
        obj.id = +obj.id;
      }
      else if (Array.isArray(obj[k])) {
        // Recurse this function for all elements in arrays given
        obj[k].forEach(o => Cleaner.clean(o));
      }
      else if (obj[k] && typeof obj[k] === 'object') {
        // Recurse this function for all sub-objects given
        Cleaner.clean(obj[k]);
      }
    });
    return obj;
  }
}
