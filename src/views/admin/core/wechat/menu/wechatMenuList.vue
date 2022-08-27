<template>
  <div :style="{ height: '100%', overflowY: 'auto' }">
    <sp-header>
      <div>
        <div style="display: inline-block">
          <slot name="buttons"></slot>
        </div>
        <!-- 按钮组 -->
        <div style="display: inline-block">
          <a-tooltip title="发布">
            <a-button :icon="'check'" @click="publish()" style="margin-right: 10px"></a-button>
          </a-tooltip>
        </div>
      </div>
    </sp-header>
    <div :style="{margin: '10px'}">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-row>
            <a-tooltip title="创建新菜单">
              <a-button :icon="'plus'" @click="create()" size="small"></a-button>
            </a-tooltip>
          </a-row>
          <a-row>
            <a-tree
              draggable
              show-line
              :expanded-keys="expandedKeys"
              :replaceFields="{ title: 'name', children: 'sub_button' }"
              :tree-data="tableData"
              :auto-expand-parent="true"
              :default-expand-all="true"
              @drop="onDrop"
            >
              <template #title="{ key: treeKey, name }">
                <a-dropdown :trigger="['contextmenu']">
                  <span>{{ name }}</span>
                  <template #overlay>
                    <a-menu @click="({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)">
                      <a-menu-item key="add">新增子菜单</a-menu-item>
                      <a-menu-item key="edit">编辑</a-menu-item>
                      <a-menu-item key="delete">删除</a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
            </a-tree>
          </a-row>
        </a-col>
        <a-col :span="18">
          <editComponent ref="edit" :data="selectedRow" @save="save"></editComponent>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import editComponent from './wechatMenuEdit.vue';
import { uuid } from '@sixpence/web-core'

export default {
  name: 'sysMenuList',
  components: { editComponent },
  data() {
    return {
      controllerName: 'wechat_menu',
      expandedKeys: [],
      selectedRow: {},
      tableData: []
    };
  },
  beforeCreate() {
    sp.get('api/wechat_menu').then(resp => {
      if (sp.isNullOrEmpty(resp.selfmenu_info)) {
        return; 
      }

      // 微信公众号最多二级菜单
      this.tableData = resp.selfmenu_info.button.map(e => {
        if (sp.isNullOrEmpty(e.key)) {
          e.key = uuid.generate();
        }

        if (e.sub_button) {
          e.sub_button = e.sub_button.list;
          e.sub_button.forEach(item => {
            if (sp.isNullOrEmpty(item.key)) {
              item.key = uuid.generate()
            }
          });
          if (!sp.isNullOrEmpty(e.sub_button)) {
            this.expandedKeys.push(e.key);
          }
        }
        return e;
      });
    });
  },
  methods: {
    onDrop(info) {
      const dropKey = info.node.eventKey;
      const dragKey = info.dragNode.eventKey;
      const dropPos = info.node.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr);
          }
          if (item.sub_button) {
            return loop(item.sub_button, key, callback);
          }
        });
      };
      const data = [...this.tableData];

      // Find dragObject
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.sub_button = item.sub_button || [];
          // where to insert 示例添加到尾部，可以是随意位置
          if (this.expandedKeys.findIndex(e => e.key === item.key) === -1) {
            this.expandedKeys.push(item.key);
          }
          item.sub_button.push(dragObj);
        });
      } else if (
        (info.node.sub_button || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.sub_button = item.sub_button || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.sub_button.unshift(dragObj);
        });
      } else {
        let ar;
        let i;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      this.tableData = data;
    },
    onContextMenuClick(treeKey, menuKey) {
      switch (menuKey) {
        case 'delete': {
          var loop = (key, data) => {
            var i = data.findIndex(e => e.key === key);
            if (i !== -1) {
              data.splice(i, 1);
              this.$forceUpdate();
            } else {
              data.forEach(e => {
                if (e.sub_button && e.sub_button.length > 0) {
                  loop(key, e.sub_button);
                }
              });
            }
          };
          loop(treeKey, this.tableData);
          if (this.selectedRow.key === treeKey) {
            this.selectedRow = {};
          }
          break;
        }
        case 'edit': {
          this.selectedRow = this.findItem(treeKey);
          break;
        }
        case 'add': {
          this.selectedRow = { name: '二级菜单', key: uuid.generate() };
          var parent = this.findItem(treeKey);
          if (parent.sub_button) {
            parent.sub_button.push(this.selectedRow);
          } else {
            parent.sub_button = [this.selectedRow];
          }
          if (this.expandedKeys.findIndex(e => e.key === parent.key) === -1) {
            this.expandedKeys.push(parent.key);
          }
          break;
        }
        default:
          break;
      }
    },
    findItem(key) {
      var item = {};
      var loop = (data, key) => {
        data.forEach(e => {
          if (e.key === key) {
            item = e;
          }
          if (e.sub_button && e.sub_button.length > 0) {
            loop(e.sub_button, key);
          }
        });
      };
      loop(this.tableData, key);
      return item;
    },
    save(type, data) {
      if (type === 'create') {
        if (sp.isNullOrEmpty(data.key)) {
          data.key = uuid.generate();
        }
        this.tableData = [...this.tableData, data];
      }
    },
    create() {
      this.selectedRow = { name: '一级菜单', key: uuid.generate() };
      this.tableData.push(this.selectedRow);
    },
    publish() {
      this.$confirm({
        title: '提示',
        content: '是否确认发布菜单?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          sp.post('api/wechat_menu', { button: this.tableData }).then(() => {
            this.$message.success('发布成功');
          });
        },
        onCancel: () => {
          this.$message.info('已取消');
        }
      });
    }
  }
};
</script>
