// @web/test-runner snapshot v1

export const snapshots = {}

snapshots["component-a success states matches a string snapshot"] = 
`<div>
  A
</div>
`;
// end snapshot component-a success states matches a string snapshot

snapshots["component-a success states matches a dom element snapshot"] = 
`<div>
  B
</div>
`;
// end snapshot component-a success states matches a dom element snapshot

snapshots["component-a success states matches a dom element snapshot, using .dom"] = 
`<div>
  C
</div>
`;
// end snapshot component-a success states matches a dom element snapshot, using .dom

snapshots["component-a error states matches a lightdom snapshot"] = 
`<span>
  A
</span>
`;
// end snapshot component-a error states matches a lightdom snapshot

snapshots["component-a error states matches shadow dom snapshot"] = 
`<span>
  B
</span>
`;
// end snapshot component-a error states matches shadow dom snapshot

snapshots["component-a failed snapshots does not throw an error when a snapshot does not match using negate"] = 
`<div>
  0.6642129660058023
</div>
`;
// end snapshot component-a failed snapshots does not throw an error when a snapshot does not match using negate

snapshots["component-a failed snapshots throws an error when a snapshot does not match expect"] = 
`<div>
  0.6658657752604571
</div>
`;
// end snapshot component-a failed snapshots throws an error when a snapshot does not match expect

snapshots["component-a failed snapshots throws an error when a snapshot does not match assert"] = 
`<div>
  0.8436381191382845
</div>
`;
// end snapshot component-a failed snapshots throws an error when a snapshot does not match assert

snapshots["component-b success states can ignore attributes  assert"] = 
`<div>
  A
</div>
`;
// end snapshot component-b success states can ignore attributes  assert

snapshots["component-b error states can ignore tags assert"] = 
`<div>
  A
</div>
`;
// end snapshot component-b error states can ignore tags assert

snapshots["component-b success states can ignore attributes  expect"] = 
`<div>
  A
</div>
`;
// end snapshot component-b success states can ignore attributes  expect

snapshots["component-b error states can ignore tags expect"] = 
`<div>
  A
</div>
`;
// end snapshot component-b error states can ignore tags expect

