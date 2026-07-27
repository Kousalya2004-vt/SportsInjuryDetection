import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      <div style={{textAlign:"center",marginTop:"50px"}}>
        <h1>Sports Injury Detection Platform</h1>
        <p>Upload sports videos and analyze injury risk.</p>
      </div>
    </>
  );
}

export default Home;