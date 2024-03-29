export function BackgroundBlob() {
  return (
    <div className='fixed inset-0 -z-10 overflow-hidden blur-[128px]'>
      <div
        className='absolute inset-0 m-auto
          animate-blob
          rounded-[100%] h-[50vh] w-[50vh] 
          bg-gradient-to-t from-red-500 via-orange-500 to-blue-500
          opacity-5 sm:opacity-10
          '
      />
    </div>
  );
}
