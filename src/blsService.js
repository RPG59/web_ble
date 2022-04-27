import * as protobuf from "protobufjs";

export function startBle() {
  // const uuid = BluetoothUUID.getService("device_information");
  // const genericAccess = BluetoothUUID.getService("generic_access");
  // const genericAttribute = BluetoothUUID.getService("generic_attribute");
  const customUid = "15a0737e-446b-4ae2-aa25-1057f8ac05c7";
  //   const req = BluetoothUUID.getCharacteristic("apparent_wind_direction");
  //   >> Characteristic: 00002a28-0000-1000-8000-00805f9b34fb [READ]
  // >> Characteristic: 00002a29-0000-1000-8000-00805f9b34fb [READ]
  const chars0 = "eb32dd8b-41dd-46ea-9253-6da6e58406d5"; // empty
  const chars1 = "c4f0f4ff-001c-47cc-ab1f-97014e8769f8"; // not permitted
  const chars2 = "770c09ff-9cff-4d32-9cb0-3065acca479a"; // empty (Read)
  const chars3 = "03ed5a64-9e5f-4749-b94e-d3bd6175847c"; // not permitted (wirte)
  const chars4 = "ecd80baf-a724-4783-a874-6f4f46ef8ae6"; // 76 (L) session/

  let __service = null;
  navigator.bluetooth
    .requestDevice({
      acceptAllDevices: true,
      optionalServices: [customUid],
    })
    .then((device) => device.gatt.connect())
    .then((server) => server.getPrimaryService(customUid))
    .then((service) => {
      console.log(service);
      __service = service;
      return service.getCharacteristic(chars4);
    })
    .then((characteristic) => characteristic.readValue())
    .then((value) => {
      const sessionId = new Uint8Array(value.buffer)[0];
      console.log(sessionId);

      protobuf.load("/proto/main.proto").then((root) => {
        const message = root.lookupType("main.StarBLEMessage");
        const payload = {
          type: 1,
        };

        if (message.verify(payload)) {
          throw new Error("Verify failed!");
        }

        const protoData = message.create(payload);
        const buffer = message.encode(protoData).finish();
        console.log("buffer", buffer);
        const header = new Uint8Array([sessionId, 0, 1, 0, 1]);
        const finalMessage = new Uint8Array([...header, ...buffer]);
        console.log(finalMessage);

        __service
          .getCharacteristic(chars3)
          .then((x) => x.writeValue(finalMessage))
          .then((foobar) => {
            console.log(foobar);
          });
      });
      // });

      // const decoder = new TextDecoder();
      // console.log(decoder.decode(value));
    });
}
