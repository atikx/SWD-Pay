function Watermark() {
  return (
    <div  className="absolute z-[1000] bottom-4 w-screen flex justify-center px-8 sm:px-12 text-center">
        <div  className="backdrop-blur-md bg-white/30 px-12 p-2 rounded-full shadow-lg">
          <p  className="text-white text-sm">
            Made with ❤️ by <span className="font-bold">Atiksh Gupta  </span>
          </p>
        </div>
      </div>
  )
}
export default Watermark