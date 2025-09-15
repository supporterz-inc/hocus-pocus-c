interface Props {
  text: string;
  path: string;
}

export function Button({ text, path }: Props) {
  return (
    <div class="my-4">
      <a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href={path}>
        {text}
      </a>
    </div>
  );
}
