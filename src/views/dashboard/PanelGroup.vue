<template>
  <el-row :gutter="18" class="panel-group">
    <el-col
      :span="6"
      class="card-panel-col"
      v-for="item in panelList"
      :key="item.id"
    >
      <div class="card-panel" @click="handlePanelClick(item.id)">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon
            :icon-class="`${item.logo}_icon`"
            class-name="card-panel-icon"
          />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ item.alias }}
          </div>
          <count-to
            :start-val="0"
            :end-val="item.num"
            :duration="1600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
    <el-col :span="6" class="card-panel-col">
      <div class="card-panel" @click="handlePanelClick('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="alter" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">报警数</div>
          <count-to
            :start-val="0"
            :end-val="0"
            :duration="3600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from "vue-count-to";

export default {
  components: {
    CountTo,
  },
  props: {
    panelList: {
      type: Array,
      default: [],
    },
  },
  methods: {
    handlePanelClick(type) {
      this.$emit("handlePanelClick", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
    overflow: hidden;
  }

  .card-panel {
    display: flex;
    justify-content: space-between;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    border-radius: 16px;

    &:hover {
      .card-panel-icon {
        font-size: 52px;
      }
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
