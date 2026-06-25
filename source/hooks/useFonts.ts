import { useFonts as useExpoFonts } from 'expo-font'

export function useFonts() {
  const [loaded, error] = useExpoFonts({
    'ClashGrotesk-Extralight': require('../fonts/Clash-Grotesk/Fonts/OTF/ClashGrotesk-Extralight.otf'),
    'ClashGrotesk-Light': require('../fonts/Clash-Grotesk/Fonts/OTF/ClashGrotesk-Light.otf'),
    'ClashGrotesk-Regular': require('../fonts/Clash-Grotesk/Fonts/OTF/ClashGrotesk-Regular.otf'),
    'ClashGrotesk-Medium': require('../fonts/Clash-Grotesk/Fonts/OTF/ClashGrotesk-Medium.otf'),
    'ClashGrotesk-Semibold': require('../fonts/Clash-Grotesk/Fonts/OTF/ClashGrotesk-Semibold.otf'),
    'ClashGrotesk-Bold': require('../fonts/Clash-Grotesk/Fonts/OTF/ClashGrotesk-Bold.otf'),
    'ClashGrotesk-Variable': require('../fonts/Clash-Grotesk/Fonts/TTF/ClashGrotesk-Variable.ttf'),

    'GeneralSans-Extralight': require('../fonts/General-Sans/Fonts/OTF/GeneralSans-Extralight.otf'),
    'GeneralSans-Light': require('../fonts/General-Sans/Fonts/OTF/GeneralSans-Light.otf'),
    'GeneralSans-Regular': require('../fonts/General-Sans/Fonts/OTF/GeneralSans-Regular.otf'),
    'GeneralSans-Medium': require('../fonts/General-Sans/Fonts/OTF/GeneralSans-Medium.otf'),
    'GeneralSans-Semibold': require('../fonts/General-Sans/Fonts/OTF/GeneralSans-Semibold.otf'),
    'GeneralSans-Bold': require('../fonts/General-Sans/Fonts/OTF/GeneralSans-Bold.otf'),
    'GeneralSans-Variable': require('../fonts/General-Sans/Fonts/TTF/GeneralSans-Variable.ttf')
  })

  return [loaded, error] as const
}