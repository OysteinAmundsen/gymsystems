import { Helper } from './Helper';

const maxLevel = [
  { level: 0, children: [
    { level: 1}
  ]}
];
describe('services:Helper', () => {
  it('should return an equal object', () => {
    const reduced = Helper.reduceLevels(maxLevel);
    expect(JSON.stringify(reduced)).toEqual(JSON.stringify(maxLevel), 'Objects not equal');
  });


  it('should return a simplified object', () => {
    const obj = [
      { level: 0, children: [
        { level: 1, children: [
          { level: 2, children: [
            { level: 3, children: [
              { level: 4 }
            ]}
          ] }
        ]}
      ]}
    ];
    const reduced = Helper.reduceLevels(obj);
    expect(JSON.stringify(reduced)).toEqual(JSON.stringify(maxLevel), 'Object should be reduced by max levels');
  });
});
