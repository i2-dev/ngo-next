import { FadeDown, FadeUp, FadeLeft, FadeRight, ZoomIn } from '@/components/SimpleAnimatedElement';

// 從上方淡入
<FadeDown delay={100} duration={600}>
  <h1>標題</h1>
</FadeDown>

// 從下方淡入
<FadeUp delay={200} duration={800}>
  <p>內容</p>
</FadeUp>