export class Helper {

  /**
   * Take an object and discard sublevels.
   *
   * This is done to reduce unnecessarily large payloads in update statements
   *
   * @param {any} obj The object to reduce
   * @param {number} level [default = 2] specification of how many levels to retain
   */
  static reduceLevels(obj: any, level: number = 3): any {
    if (obj != null && level >= 0) {
      if (Array.isArray(obj)) {
        return obj.reduce((prev, current) => {
          const o = Helper.reduceLevels(current, level);
          if (o) {
            if (!prev) { prev = []; }
            prev.push(o);
          }
          return prev;
        }, undefined);
      } else if (obj instanceof Date) {
        return obj;
      } else if (typeof obj === 'object') {
        return Object.keys(obj).reduce((prev, current) => {
          const o = Helper.reduceLevels(obj[current], level - 1);
          if (o != null) {
            if (!prev) { prev = {}; }
            prev[current] = o;
          }
          return prev;
        }, <{}> undefined);
      }
      return obj;
    }
    return null;
  }
}
