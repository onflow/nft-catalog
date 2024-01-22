

const Notice = () => {
  return (
      <div className="bg-red-300 flex flex-1 flex-col items-center justify-between w-full py-[0.25rem] px-0 h-[60px]">
        <div className="flex justify-center items-center text-center text-[color:inherit] text-[14px] p-[0.15rem]">
          ⚠ Upgrade to Cadence 1.0
        </div>
        <div className="flex justify-center items-center text-center text-[color:inherit] text-[14px] p-[0.15rem]">
          The Crescendo network upgrade, including Cadence 1.0, is coming soon.
          You most likely need to update all your contracts/transactions/scripts
          to support this change.
        </div>
        <div className="flex justify-center items-center text-center text-[color:inherit] text-[14px] p-[0.15rem]">
          Please visit our migration guide here:&nbsp;&nbsp;
          <a
            className="underline text-[color:inherit]"
            target="_blank"
            href="https://cadence-lang.org/docs/cadence-migration-guide"
            rel="noreferrer"
            title="Report a Bug"
          >
            https://cadence-lang.org/docs/cadence-migration-guide
          </a>
        </div>
      </div>
  );
};


export default Notice;
