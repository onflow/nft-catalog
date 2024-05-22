import { MdClose } from 'react-icons/md'
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const FLAG_COOKIE_NAME = 'stable-cadence-announcement-dismissed';

const parseFlag = (flag: any) => {
  try {
    return JSON.parse(flag)
  } catch {
    return false;
  }

}

const Notice = () => {
  const [isDismissed, setFlag] = useState<boolean>(() => {
    // Try to read the flag value from the cookie, default to false if not found
    const cookieFlag = Cookies.get(FLAG_COOKIE_NAME);
    return cookieFlag ? parseFlag(cookieFlag) : false;
  });

  useEffect(() => {
    // When the flag changes, update the cookie
    Cookies.set(FLAG_COOKIE_NAME, String(isDismissed), { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
  }, [isDismissed]);

  const toggleFlag = () => {
    setFlag(prevFlag => !prevFlag);
  };
  if (isDismissed) {
    return null
  }
  return (
    <div className="bg-blue-300 flex flex-1 items-center w-full px-0 h-16">
      <div className="flex flex-1 flex-col items-center justify-around py-2 px-0 text-white">
        <div className="flex justify-center items-center text-center text-[color:inherit] text-[14px] p-[0.15rem]">
          🔧 Upgrade to Cadence 1.0 🔧
        </div>
        <div className="flex justify-center items-center text-center text-[color:inherit] text-[14px] p-[0.15rem] gap-1">
          The highly anticipated 
          <a href="https://flow.com/upgrade/crescendo" target="_blank" className="underline">Crescendo</a>
          network upgrade is coming soon with 20+ new
          <a href="https://flow.com/upgrade/cadence-1" target="_blank" className="underline">Cadence 1.0</a>
          features and 
          <a href="https://flow.com/upgrade/evm" target="_blank" className="underline">EVM</a>
          equivalence.
        </div>
      </div>
      <button className='flex h-10 w-10 items-center justify-center' onClick={toggleFlag}>
        <MdClose/>
      </button>
    </div>
  );
};


export default Notice;
