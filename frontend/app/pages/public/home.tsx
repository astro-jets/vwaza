import DefaultLayout from "~/components/layouts/DefaultLayout";
import DefaultLoader from "~/components/layouts/DefaultLoader";
import LandingTemplate from "~/components/templates/LandingTemplate";


export default function Home() {
  return (
    <>
      <DefaultLoader />
      <DefaultLayout>
        <LandingTemplate />
      </DefaultLayout>
    </>
  );
}

