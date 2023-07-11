import { Link } from "react-router-dom";

const Home = () => {
    
    return (
        <div className="flex-col justify-between space-y-1 lg:flex-col sm:flex-row place-content-center overflow-scroll bg-white h-screen ">
                <div className="border border-white radius-for-skewed p-2 m-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 pt-12 ">
                        <div className="p-4 flex flex-col items-center justify-center w-full ">
                            <div className="w-full text-center lg:text-left">
                                <div className="max-w-sm mx-auto">
                                    <h2 className="flex mb-6 text-4xl lg:text-5xl font-bold font-heading ">
                                        <p className="text-black">Follow your evolution</p>
                                    </h2>
                                </div>
                                <div className="max-w-sm mx-auto">
                                    <p className="mb-6 leading-loose text-black">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque efficitur nisl sodales egestas lobortis.</p>
                                    <div>
                                        <a className="inline-block mb-3 lg:mb-0 lg:mr-3 w-full lg:w-auto py-2 px-6 leading-loose bg-green-600 hover:bg-green-700 text-white font-semibold rounded-l-xl rounded-t-xl transition duration-200" href="/login">Get Started</a>
                                        <a className="inline-block w-full lg:w-auto py-2 px-6 leading-loose font-semibold bg-white  transition duration-200 text-black" href="/#">How it works</a></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 flex flex-col items-center justify-center w-full">
                            {/* <img
                                src={`https://www.airlines.iata.org/sites/default/files/event_images/web_plane_iStock-1148581150_0.png`}
                                className="rounded-lg"
                            ></img> */}
                        </div>
                        <Link to="/login">About</Link>

                    </div>
                </div>
            </div>
    )
}

export default Home;