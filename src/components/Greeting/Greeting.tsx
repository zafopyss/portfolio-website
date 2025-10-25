type GreetingProps = {
  name: string;
  className?: string;
};

function Greeting({ name, className }: GreetingProps)  {
  return <h1 className={`text-2xl ${className}`}>Hello, {name}!</h1>;
}

export default Greeting;
