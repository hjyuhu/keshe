<template>
  <div class="dashboard">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="logo-section">
        <div class="logo">
          <el-icon :size="24" color="white">
            <TrendCharts />
          </el-icon>
        </div>
        <div>
          <h1 class="title">舆情情感实时监测系统</h1>
          <p class="update-time">更新时间：{{ currentTime }}</p>
        </div>
      </div>
      
      <div class="right-section">
        <div class="connection-status">
          <span class="status-dot"></span>
          <span>连接正常</span>
        </div>
        
        <el-button text circle>
          <el-icon :size="20">
            <Bell />
          </el-icon>
        </el-button>
        
        <el-button text circle>
          <el-icon :size="20">
            <Setting />
          </el-icon>
        </el-button>
        
        <div class="user-info">
          <el-avatar :size="32" :src="userAvatar" />
          <span class="username">管理员</span>
        </div>
      </div>
    </header>

    <main class="main-content">
      <!-- 概览数据卡片 -->
      <div class="overview-cards">
        <el-card 
          v-for="card in overviewCards"
          :key="card.title"
          class="overview-card"
          :class="`card-${card.type}`"
        >
          <div class="card-header">
            <div>
              <p class="card-label">{{ card.label }}</p>
              <h3 class="card-value">{{ card.value }}</h3>
            </div>
            <div class="card-icon">
              <el-icon :size="24" :color="card.iconColor">
                <component :is="card.icon" />
              </el-icon>
            </div>
          </div>
          <div class="card-trend">
            <span :class="`trend-${card.trendType}`">
              <el-icon>
                <component :is="card.trendIcon" />
              </el-icon>
              {{ card.trendValue }}
            </span>
            <span class="trend-label">{{ card.trendLabel }}</span>
          </div>
        </el-card>
      </div>

      <!-- 中间图表区域 -->
      <div class="chart-section">
        <!-- 趋势图 -->
        <el-card class="chart-card trend-chart">
          <template #header>
            <div class="chart-header">
              <div>
                <h2>24小时情感趋势分析</h2>
                <p>动态监控各情感维度的时间维度变化</p>
              </div>
              <div class="time-selector">
                <el-button 
                  :type="timeRange === '24h' ? 'primary' : 'text'"
                  @click="timeRange = '24h'"
                >24小时</el-button>
                <el-button 
                  :type="timeRange === '7d' ? 'primary' : 'text'"
                  @click="timeRange = '7d'"
                >7天</el-button>
              </div>
            </div>
          </template>
          <div ref="trendChartRef" class="chart-container"></div>
        </el-card>

        <!-- 情感分布饼图 -->
        <el-card class="chart-card emotion-distribution">
          <template #header>
            <div>
              <h2>情感分布占比</h2>
              <p>当前全网情感构成的量化分析</p>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
          <div class="emotion-stats">
            <div 
              v-for="stat in emotionStats"
              :key="stat.type"
              class="stat-item"
            >
              <div class="stat-label">
                <span class="color-dot" :class="`dot-${stat.type}`"></span>
                <span>{{ stat.label }}</span>
              </div>
              <span class="stat-value">{{ stat.value }}%</span>
            </div>
          </div>
        </el-card>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { ECOption } from '@/types/echarts'
import { 
  TrendCharts, Bell, Setting, ChatRound, 
  Smile, Warning, Clock 
} from '@element-plus/icons-vue'

// 当前时间
const currentTime = ref('')
const updateTime = () => {
  const now = new Date()
  currentTime.value = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
}

let timer: number

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  initCharts()
})

onUnmounted(() => {
  clearInterval(timer)
})

// 概览卡片数据
const overviewCards = ref([
  {
    label: '全网舆情总量',
    value: '128,492',
    type: 'total',
    icon: ChatRound,
    iconColor: '#4f46e5',
    trendType: 'up',
    trendIcon: 'TrendingUp',
    trendValue: '+12.5%',
    trendLabel: '较昨日同期'
  },
  {
    label: '正面情感占比',
    value: '64.2%',
    type: 'positive',
    icon: Smile,
    iconColor: '#10b981',
    trendType: 'up',
    trendIcon: 'TrendingUp',
    trendValue: '+3.1%',
    trendLabel: '较昨日同期'
  },
  {
    label: '严重负面预警',
    value: '12',
    type: 'warning',
    icon: Warning,
    iconColor: '#ef4444',
    trendType: 'up',
    trendIcon: 'TrendingUp',
    trendValue: '+2',
    trendLabel: '需立即处理'
  },
  {
    label: '平均响应时间',
    value: '24.5',
    type: 'response',
    icon: Clock,
    iconColor: '#f59e0b',
    trendType: 'down',
    trendIcon: 'TrendingDown',
    trendValue: '-4.2%',
    trendLabel: '处理效率提升'
  }
])

// 情感统计数据
const emotionStats = ref([
  { type: 'positive', label: '正面情绪', value: '64.2' },
  { type: 'neutral', label: '中性情绪', value: '22.8' },
  { type: 'negative', label: '负面情绪', value: '13.0' }
])

// 时间范围
const timeRange = ref('24h')

// 图表相关
const trendChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null

const initCharts = () => {
  if (trendChartRef.value) {
    trendChart = echarts.init(trendChartRef.value)
    const trendOption: ECOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['正面', '负面', '中性'],
        textStyle: {
          color: '#94a3b8'
        },
        top: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '18%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
        axisLine: {
          lineStyle: {
            color: '#475569'
          }
        },
        axisLabel: {
          color: '#94a3b8'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#475569'
          }
        },
        axisLabel: {
          color: '#94a3b8'
        },
        splitLine: {
          lineStyle: {
            color: '#1e293b',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '正面',
          type: 'line',
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210, 180, 190, 210, 240, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 380],
          lineStyle: {
            color: '#10b981'
          },
          itemStyle: {
            color: '#10b981'
          }
        },
        {
          name: '负面',
          type: 'line',
          smooth: true,
          data: [20, 32, 41, 34, 50, 30, 20, 18, 29, 31, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
          lineStyle: {
            color: '#ef4444'
          },
          itemStyle: {
            color: '#ef4444'
          }
        },
        {
          name: '中性',
          type: 'line',
          smooth: true,
          data: [60, 72, 81, 74, 70, 80, 90, 82, 79, 81, 84, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98],
          lineStyle: {
            color: '#94a3b8'
          },
          itemStyle: {
            color: '#94a3b8'
          }
        }
      ]
    }
    trendChart.setOption(trendOption)
  }

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    const pieOption: ECOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '情感分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#0f172a',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 18,
              fontWeight: 'bold',
              color: '#f1f5f9'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 64.2, name: '正面情绪', itemStyle: { color: '#10b981' } },
            { value: 22.8, name: '中性情绪', itemStyle: { color: '#94a3b8' } },
            { value: 13.0, name: '负面情绪', itemStyle: { color: '#ef4444' } }
          ]
        }
      ]
    }
    pieChart.setOption(pieOption)
  }

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

const handleResize = () => {
  trendChart?.resize()
  pieChart?.resize()
}

// 用户头像
const userAvatar = '/agent-py/media/generated_images/2025-12-29/4cb929f3343c44a79e5acd5ab92e43a9.jpg'
</script>

<style scoped lang="scss">
.dashboard {
  min-height: 100vh;
  background-color: $bg-dark;
}

.header {
  height: 64px;
  border-bottom: 1px solid $border-color;
  background-color: rgba($bg-dark, 0.5);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  
  .logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .logo {
      width: 40px;
      height: 40px;
      background: $primary-color;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
    }
    
    .title {
      font-size: 20px;
      font-weight: bold;
      background: linear-gradient(to right, white, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 0;
    }
    
    .update-time {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }
  }
  
  .right-section {
    display: flex;
    align-items: center;
    gap: 24px;
    
    .connection-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      background: $bg-card;
      padding: 6px 12px;
      border-radius: 9999px;
      border: 1px solid $border-color;
      
      .status-dot {
        width: 8px;
        height: 8px;
        background: #10b981;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-left: 24px;
      border-left: 1px solid $border-color;
      
      .username {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.main-content {
  padding: 32px;
  max-width: 1600px;
  margin: 0 auto;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 24px;
  margin-bottom: 32px;
  
  @include md {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @include lg {
    grid-template-columns: repeat(4, 1fr);
  }
}

.overview-card {
  background: rgba($bg-card, 0.5);
  border: 1px solid rgba($border-color, 0.5);
  border-radius: 16px;
  transition: border-color $transition-normal;
  
  &:hover {
    border-color: rgba($primary-color, 0.5);
  }
  
  &.card-positive:hover {
    border-color: rgba($success-color, 0.5);
  }
  
  &.card-warning:hover {
    border-color: rgba($danger-color, 0.5);
  }
  
  &.card-response:hover {
    border-color: rgba($warning-color, 0.5);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    
    .card-label {
      font-size: 14px;
      color: $text-secondary;
      margin: 0;
    }
    
    .card-value {
      font-size: 32px;
      font-weight: bold;
      margin: 8px 0 0;
      
      .card-positive & {
        color: $success-color;
      }
      
      .card-warning & {
        color: $danger-color;
      }
    }
    
    .card-icon {
      padding: 8px;
      background: rgba($primary-color, 0.1);
      border-radius: 8px;
      
      .card-positive & {
        background: rgba($success-color, 0.1);
      }
      
      .card-warning & {
        background: rgba($danger-color, 0.1);
      }
      
      .card-response & {
        background: rgba($warning-color, 0.1);
      }
    }
  }
  
  .card-trend {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    margin-top: 16px;
    
    .trend-up {
      color: $success-color;
      display: flex;
      align-items: center;
      gap: 2px;
    }
    
    .trend-down {
      color: $success-color;
      display: flex;
      align-items: center;
      gap: 2px;
    }
    
    .trend-label {
      color: $text-muted;
    }
  }
}

.chart-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  
  @include lg {
    grid-template-columns: 2fr 1fr;
  }
  
  .chart-card {
    background: rgba($bg-card, 0.3);
    border: 1px solid rgba($border-color, 0.5);
    border-radius: 24px;
    
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      
      h2 {
        font-size: 20px;
        font-weight: bold;
        margin: 0;
      }
      
      p {
        font-size: 14px;
        color: $text-secondary;
        margin: 4px 0 0;
      }
      
      .time-selector {
        background: $bg-dark;
        border-radius: 8px;
        padding: 4px;
        border: 1px solid $border-color;
        
        :deep(.el-button) {
          margin: 0;
        }
      }
    }
    
    .chart-container {
      width: 100%;
      height: 400px;
      
      .emotion-distribution & {
        height: 320px;
      }
    }
  }
}

.emotion-stats {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    
    .stat-label {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .color-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        
        &.dot-positive {
          background: $success-color;
        }
        
        &.dot-neutral {
          background: $info-color;
        }
        
        &.dot-negative {
          background: $danger-color;
        }
      }
    }
    
    .stat-value {
      font-family: monospace;
      color: $text-secondary;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>