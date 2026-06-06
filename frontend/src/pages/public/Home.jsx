import MainLayout from "../../layouts/MainLayout";
import Banner from "../../components/home/Banner";
import SpecialityFilter from "../../components/home/SpecialityFilter";
import TopDoctors from "../../components/home/TopDoctors";
import AppStats from "../../components/home/AppStats";
import Reviews from "../../components/home/Reviews";

function Home() {
  return (
    <MainLayout>
      <div>
        <Banner />
        <SpecialityFilter />
        <TopDoctors />
        <Reviews />
        <AppStats />
      </div>
    </MainLayout>
  );
}

export default Home;
