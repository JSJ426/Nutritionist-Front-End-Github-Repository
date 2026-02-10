export default function OpenSourceContent() {
  const packages = [
    { name: 'React', version: '18.3.1', license: 'MIT', url: 'https://github.com/facebook/react' },
    { name: 'React DOM', version: '18.3.1', license: 'MIT', url: 'https://github.com/facebook/react' },
    { name: 'Vite', version: '6.3.5', license: 'MIT', url: 'https://github.com/vitejs/vite' },
    { name: 'Tailwind CSS', version: '4.1.3', license: 'MIT', url: 'https://github.com/tailwindlabs/tailwindcss' },
    { name: 'Radix UI', version: '-', license: 'MIT', url: 'https://github.com/radix-ui/primitives' },
    { name: 'Lucide React', version: '0.487.0', license: 'ISC', url: 'https://github.com/lucide-icons/lucide' },
    { name: 'Recharts', version: '2.15.2', license: 'MIT', url: 'https://github.com/recharts/recharts' },
    { name: 'React Hook Form', version: '7.55.0', license: 'MIT', url: 'https://github.com/react-hook-form/react-hook-form' },
    { name: 'Sonner', version: '2.0.3', license: 'MIT', url: 'https://github.com/emilkowalski/sonner' },
    { name: 'cmdk', version: '1.1.1', license: 'MIT', url: 'https://github.com/pacocoursey/cmdk' },
    { name: 'class-variance-authority', version: '0.7.1', license: 'Apache-2.0', url: 'https://github.com/joe-bell/cva' },
    { name: 'clsx', version: '-', license: 'MIT', url: 'https://github.com/lukeed/clsx' },
    { name: 'tailwind-merge', version: '-', license: 'MIT', url: 'https://github.com/dcastil/tailwind-merge' },
    { name: 'Embla Carousel', version: '8.6.0', license: 'MIT', url: 'https://github.com/davidjerleke/embla-carousel' },
    { name: 'React Day Picker', version: '8.10.1', license: 'MIT', url: 'https://github.com/gpbl/react-day-picker' },
    { name: 'React Zoom Pan Pinch', version: '-', license: 'MIT', url: 'https://github.com/BetterTyped/react-zoom-pan-pinch' },
    { name: 'React Resizable Panels', version: '2.1.7', license: 'MIT', url: 'https://github.com/bvaughn/react-resizable-panels' },
    { name: 'Vaul', version: '1.1.2', license: 'MIT', url: 'https://github.com/emilkowalski/vaul' },
    { name: 'input-otp', version: '1.4.2', license: 'MIT', url: 'https://github.com/guilhermerodz/input-otp' },
    { name: 'next-themes', version: '0.4.6', license: 'MIT', url: 'https://github.com/pacocoursey/next-themes' },
  ];

  return (
    <div className="space-y-6 text-gray-700">
      <div className="text-sm leading-relaxed">
        <p>
          본 서비스는 아래의 오픈소스 소프트웨어를 사용하고 있습니다.
          각 소프트웨어의 저작권 및 라이선스 조건은 해당 프로젝트의 라이선스를 따릅니다.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-2 pr-4 font-semibold text-gray-800">패키지</th>
              <th className="text-left py-2 pr-4 font-semibold text-gray-800">버전</th>
              <th className="text-left py-2 font-semibold text-gray-800">라이선스</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.name} className="border-b border-gray-100">
                <td className="py-2 pr-4">
                  <a
                    href={pkg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline"
                  >
                    {pkg.name}
                  </a>
                </td>
                <td className="py-2 pr-4 text-gray-500">{pkg.version}</td>
                <td className="py-2 text-gray-600">{pkg.license}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500 leading-relaxed space-y-2">
        <p>
          위 목록은 주요 의존성만 포함하고 있으며, 전체 의존성 트리에 포함된 패키지는 이보다 많을 수 있습니다.
        </p>
        <p>
          MIT 라이선스: Permission is hereby granted, free of charge, to any person obtaining a copy of this software
          and associated documentation files, to deal in the Software without restriction, including without limitation
          the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
          subject to the following conditions: The above copyright notice and this permission notice shall be included
          in all copies or substantial portions of the Software.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.
        </p>
      </div>
    </div>
  );
}
