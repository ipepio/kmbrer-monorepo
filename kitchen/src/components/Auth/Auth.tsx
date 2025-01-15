export interface IAuthProps {
    children: React.ReactNode;
  }
  
  export function Auth({ children }: IAuthProps) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="xs:w-11/12 lg:w-8/12 flex justify-center">
          <div className="py-16 px-2 bg-white xs:w-full lg:w-1/2 rounded-md shadow-md">
            {children}
          </div>
        </div>
      </div>
    );
  }
  