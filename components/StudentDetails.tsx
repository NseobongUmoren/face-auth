import { useRouter } from 'next/router';
import { useEffect, useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';

export interface List {
  id: number;
  photo: string;
  name: string;
  jambNo: string;
  course: string;
  phone: string;
  email: string;
  gender: number;
  capture: string;
  compare: string;
  status: number;
}

const StudentDetails: React.FC = () => {

  const router = useRouter();
  const { id } = router.query;
  const [studentData, setStudentData] = useState<List | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch studentData data based on the 'id' from your MySQL database here
      fetch(`/api/detailsJson?id=${id}`)
        .then((response) => response.json())
        .then((data: { student: List }) => {
          setStudentData(data.student)
          if (data.student.status === 0) {
            setAuthLevel(0);
          }
          if (data.student.status === 1) {
            setAuthLevel(3);
          }
        })
        .catch((error) => console.error('Error fetching student data:', error));
    }
  }, [id]);

  const webcamRef = useRef<Webcam>(null);
  const [capt, setCapt] = useState('');
  const [authLevel, setAuthLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [failedMessage, setFailedMessage] = useState('FACE MISMATCH:');

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot() || '';
    // Save the captured image to the state or use it for form submission
    if (imageSrc.trim() != '') {
      setCapt(imageSrc);
      setAuthLevel(1)
    }

  }, []);

  const handleSubmit = () => {
    setAuthLevel(2);
    setLoading(true);
    fetch('/api/compare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image1: studentData?.photo,
        image2: capt,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.authenticated) {
          handleAuth(1,res.compare,capt)
        } else {
          setAuthLevel(0);
          setLoading(false);
          setFailed(true)
          setFailedMessage(res.message)
        }
      })
      .catch((error) => {
        setAuthLevel(0);
        setLoading(false);
        setFailed(true)
        setFailedMessage(error.message)
      });
  };

  const handleAuth = (status: number, compare: any, capture: string) => {
    fetch('/api/authenticateJson?id='+id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        capture,
        compare
      })
    })
    .then((response) => response.json()) 
    .then((res) => {
      if (res.authenticated) {
        setAuthLevel(3);
        setLoading(false);
        setCapt('')
      } else {
        setAuthLevel(0);
        setLoading(false);
        setFailed(true)
        setFailedMessage(res.message)
      }
    })
    .catch((error) => {
      setAuthLevel(0);
      setLoading(false);
      setFailed(true)
      setFailedMessage(error.message)
    });
  }

  return (
    <div className="overflow-x-auto">
      {studentData && (
        <>
          {studentData.status === 0 && (
            <div className='hidden md:block mb-6'>
              <h3 className="text-lg font-semibold mb-2">Authentication Progress</h3>
              <div className="md:flex w-full bg-gray-250 rounded-full">
                <div className={`w-1/3 ${authLevel > 0 ? 'bg-alt-light text-white' : 'bg-element-normal text-gray-600'} text-xs leading-none py-2 md:py-1 text-center  rounded-l-full`}>
                  <span className='hidden md:inline-block'>Step 1: Facial Capture</span>
                  <span className='inline-block md:hidden'>Step 1: <br /> Facial <br /> Capture</span>
                </div>
                <div className={`w-1/3 ${authLevel > 1 ? 'bg-alt-light text-white' : 'bg-element-normal text-gray-600'} text-xs leading-none py-2 md:py-1 text-center`}>
                  <span className='hidden md:inline-block'>Step 2: Authenticating ...</span>
                  <span className='inline-block md:hidden'>Step 2: <br /> Authenticating ...</span>
                </div>
                <div className={`w-1/3 ${authLevel > 2 ? 'bg-alt-light text-white' : 'bg-element-normal text-gray-600'} text-xs leading-none py-2 md:py-1 text-center text-gray-600 rounded-r-full`}>
                  <span className='hidden md:inline-block'>Step 3: Authentication Complete</span>
                  <span className='inline-block md:hidden'>Step 3: <br /> Authentication <br /> Complete</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex px-2 pb-4 gap-4 flex-col md:flex-row">
            <div className='w-full md:w-[30%]'>
              <div className="bg-main-light bg-opacity-40 p-4 rounded-lg shadow-md">
                <div className="flex justify-center relative">
                  <img
                    src={studentData.photo}
                    alt={studentData.name}
                    className="w-48 h-48 rounded-full"
                  />
                  {/* Authentication Badge */}
                  {studentData.status === 1 || authLevel === 3 ? (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold absolute bottom-0 right-4">
                      Authenticated
                    </span>
                  ) : (
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold absolute bottom-0 right-4">
                      Pending Authentication
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-center mt-4">{studentData.name}</h2>
                <p className="text-gray-600 text-center mt-2 break-words">{studentData.email}</p>
                <p className="text-gray-600 text-center my-2">{studentData.phone}</p>
                <p className="text-gray-600 text-center mb-4">{studentData.gender === 1 ? "Male" : "Female"}</p>

                <hr />
                <div className="mt-4 flex justify-center">
                  <ul className="list-none">
                    <li>JAMB No.: <b>{studentData.jambNo}</b></li>
                    <li>Course: <b>{studentData.course}</b></li>
                  </ul>
                </div>
              </div>
              {studentData.status === 1 && (
                <button type="button" className='text-gray-700 mt-6 font-bold w-full hover:text-white duration-200 hover:border-main-normal hover:bg-main-normal border-main-dark border-2 rounded-full px-4 py-2' >Continue with Admission Process</button>
              )}
            </div>

            {studentData.status === 0 && (
              <div className="bg-element-light bg-opacity-80 p-4 rounded-lg shadow-md w-full md:w-[70%]">

                <div className="form-group flex justify-around flex-col lg:flex-row gap-6">
                  <div className='flex flex-col items-center w-full'>
                    <h3 className='font-bold bg-main-dark text-white w-full h-6 text-center'>Webcam</h3>
                    <div className="relative w-[250px] h-[300px] my-4 rounded-full overflow-clip">
                      <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    height={300}
                    className='absolute object-cover top-0 left-0 w-full h-full'
                  />
                      <svg
                        className="absolute bg-transparent top-0 left-0 w-full h-full opacity-40"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 676 733"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M.5.5h676v733H.5Zm315,25c-23.94,9.24-51.59,6.82-74,15-79.28,30-131.6,78.44-155,165-4.65,17.2-10.73,43.95-7,67,3.67,22.66,7.65,43.88,11,64-67.79-50.83-15.93,86.79-8,110,3.68,10.77,5.09,30.72,14,36,6.22,6.41,13.1,4.09,20,1,2.24,98.72,65.31,139,125,181,30.46,21.4,75,52,131,35,36-10.92,62-32.31,88-53,52.42-41,87.14-85.93,100-166,3.83,3.66,3.73,5.31,11,6,23.4-17.55,33.41-85.61,42-119,3-11.58,9.33-36.39-2-43-5.29-5.06-18.1-3.6-27-3v-4c13.66-45.38,3.23-110.35-11-145C535.22,75.17,452,25.14,315.5,25.5Zm267,299,1,3h-1Z"
                          fill="black" // Change the color if needed
                        />
                      </svg>
                    </div>

                    <button type="button" className='text-gray-700 font-bold hover:text-white duration-200 hover:border-main-normal hover:bg-main-normal border-main-dark border-2 rounded-full px-4 py-2' onClick={capture} disabled={loading}>Capture Photo</button>
                  </div>

                  <div className='flex flex-col items-center w-full'>
                    <h3 className='font-bold bg-main-dark text-white w-full h-6 text-center'>Captured Photo</h3>
                    <div className='w-[250px] h-[300px] my-4 rounded-full overflow-hidden relative'>
                      <img src={capt} alt="" width={300} className='absolute object-cover top-0 left-0 w-full h-full' />
                      {/* Loading overlay */}
                      {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                      )}
                      {/* Success overlay */}
                      {authLevel === 3 && (
                        <div className="absolute inset-0 flex items-center flex-col text-center justify-center bg-green-500 bg-opacity-40 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <div><b>FACE MATCH: <br /> Student Authentication <br /> Successful</b></div>
                        </div>
                      )}
                      {/* Failure overlay */}
                      {failed && authLevel < 1 && (
                        <div className="absolute inset-0 flex flex-col text-center items-center justify-center bg-red-500 bg-opacity-80 text-white">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <div><b>{failedMessage} <br /> Student Authentication <br /> Failed</b></div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSubmit}
                      type="submit"
                      className="bg-main-dark text-white font-bold px-4 py-2 border-main-dark border-2 rounded-full hover:border-main-normal hover:bg-main-normal duration-200"
                      disabled={loading} // Disable the button while loading
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </>
      )}
    </div>
  );
};

export default StudentDetails;
