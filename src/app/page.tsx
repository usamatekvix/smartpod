import Banner from "@/components/banner/Banner";
import Features from "@/components/features/Features";
import NavBar from "@/components/navbar/NavBar";
import WorkFlow from "@/components/workflow/WorkFlow";

export default function Home() {
  return (
    <>
      <NavBar />
      <Banner />
      <Features />
      <WorkFlow/>
    </>
  );
}
