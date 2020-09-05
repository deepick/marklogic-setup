const upload = require("./upload.js");

test("document property definitions are evaluated in the right order", () => {
  let properties = upload.getPropertiesForPath(
    { f: { x: 1 }, foo: { x: 2 }, fooxy: { x: 3 } },
    "foo.xml"
  );
  expect(properties.x).toBe(2);
});
