import React from "react";

function Main({ children }) {
  return (
    <main className="h-full overflow-y-auto">
      <div className="container grid px-2 lg:px-3 xl:px-6 mx-auto">
        {children}
      </div>
    </main>
  );
}

export default Main;
