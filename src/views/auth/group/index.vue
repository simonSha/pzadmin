<template>
  <div class="group-box">
    <div>
      <el-button @click="open(null)" type="primary" size="small" icon="Plus"
        >新增
      </el-button>
      <el-table :data="tableData.list" border style="width: 100%">
        <el-table-column prop="id" label="id" width="180" />
        <el-table-column prop="name" label="权限名称" width="180" />
        <el-table-column prop="permissionName" label="菜单权限" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="open(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-info">
        <el-pagination
          v-model:current-page="paginationData.pageNum"
          size="small"
          :background="false"
          layout="total, prev, pager, next"
          :total="tableData.total"
          @current-change="handleCurrentChange"
        />
      </div>
      <el-dialog
        v-model="isGroupDialogVisible"
        title="添加权限"
        width="500"
        :before-close="beforeClose"
      >
        <el-form
          ref="formRef"
          label-witth="100px"
          label-position="left"
          :model="formInfo"
          :rules="rules"
        >
          <el-form-item v-show="false" prop="id">
            <el-input v-model="formInfo.id" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="formInfo.name" placeholder="请填写权限名称" />
          </el-form-item>
          <el-form-item label="权限" prop="permissions">
            <el-tree
              ref="treeRef"
              style="max-width: 600px"
              :data="permissionData"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[2, 3]"
              :default-checked-keys="defaultCheckedKeys"
              :props="defaultProps"
            ></el-tree>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="confirm(formRef)">确认</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { userGetMenu, userSetmenu, menuList } from "../../../api";

const isGroupDialogVisible = ref(false);
const permissionData = ref([]);
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

const treeRef = ref();
const defaultCheckedKeys = [4, 5];
const defaultProps = {
  children: "children",
  label: "label",
};

onMounted(() => {
  getListData();
  userGetMenu().then(({ data }) => {
    console.log(data);
    if (data.code === 10000) {
      permissionData.value = data.data;
    }
  });
});

const tableData = reactive({
  list: [],
  total: 0,
});

const getListData = () => {
  menuList(paginationData).then(({ data }) => {
    // console.log(data);
    const { list, total } = data.data;
    if (data.code === 10000) {
      tableData.list = list;
      tableData.total = total;
    }
  });
};

const formInfo = reactive({
  id: "",
  name: "",
  permissions: "",
});
const formRef = ref();
const rules = reactive({
  name: [{ required: true, trigger: "blur", message: "请输入权限名称" }],
});

const open = (rowData = {}) => {
  isGroupDialogVisible.value = true;
  if (rowData) {
    Object.assign(formInfo, { id: rowData.id, name: rowData.name });
    treeRef.value.setCheckedKeys(rowData.permission);
  }
};

const beforeClose = () => {
  isGroupDialogVisible.value = false;
  formRef.value.resetFields();
  treeRef.value.setCheckedKeys(defaultCheckedKeys);
};

const confirm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      console.log(permissions);
      formInfo.permissions = permissions;
      userSetmenu(formInfo).then(({ data }) => {
        console.log(data);
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>

<style lang="less" scoped></style>
