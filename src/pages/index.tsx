import Head from "next/head";
import VendorMap from "zicarus/components/VendorMap";

export default function Home() {
  return (
    <>
      <Head>
        <title>Icarus Drone</title>
        <meta
          name="description"
          content="Hire Drones Hire Drone Operators Hire Drone Pilots Sell Your Drone Services"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VendorMap />
    </>
  );
}
