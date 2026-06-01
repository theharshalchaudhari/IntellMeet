export const generateMeetingCode =
  () => {
    const chars =
      'abcdefghijklmnopqrstuvwxyz';

    const generatePart = () =>
      Array.from({
        length: 4,
      })
        .map(
          () =>
            chars[
              Math.floor(
                Math.random() *
                  chars.length,
              )
            ],
        )
        .join('');

    return `${generatePart()}-${generatePart()}-${generatePart()}`;
  };