import { Spinner } from '@material-tailwind/react';

export default function Loading() {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-[9999] bg-white">
      <div className="align-center relative top-[50%] flex translate-y-[-50%] flex-col items-center">
        <Spinner className="h-8 w-8" />
      </div>
    </div>
  );
}
