<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addClick" class="addrolebtn">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
          <!-- 扩展栏 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
              <!-- 渲染一级权限 -->
            <el-row
              :class="['bdbottom',i1==0?'bdtop':'','vcenter']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
           {{i1}}
              <el-col :span="5">
                <el-tag @close="removeRight(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
               <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2==0?'':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="removeRight(scope.row,item2.id)"
                      closable
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      @close="removeRight(scope.row,item3.id)"
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button @click="showSetRights(scope.row)" size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog @close="addClose" title="添加角色" :visible.sync="adddialogVisible" width="50%">
      <el-form
        :model="addruleForm"
        :rules="addruleFormRules"
        ref="addruleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addruleForm.roleName"></el-input>
        </el-form-item>

        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色 -->
    <el-dialog @close="editClose" title="修改角色" :visible.sync="editdialogVisible" width="50%">
      <el-form :model="editForm" :rules="addruleFormRules" ref="editruleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog @close="setRightsClose" title="分配权限" :visible.sync="setrightdialogVisible" width="50%">
      <el-tree ref="treeRef" :default-checked-keys="defKeys" default-expand-all node-key="id" show-checkbox :data="rightsList" :props="trueProps"></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setrightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

   
  </div>
</template>
<script>
export default {
  name: "roles",
  components: {},
  created() {
    this.getRolesList();
  },
  data() {
    return {
      rolesList: [],
      adddialogVisible: false,
      editdialogVisible: false,
      addruleForm: {
        roleName: "",
        roleDesc: ""
      },
      editForm: {},
      addruleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      setrightdialogVisible: false,
      rightsList: [],
      trueProps:{
        label:'authName',
        children:'children'
      },
      defKeys:[],
      roleId:''
    };
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      // console.log(res);

      if (res.meta.status != 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.$message.success("获取角色列表成功！")
      this.rolesList = res.data;
    },
    addClick() {
      this.adddialogVisible = true;
    },
    addClose() {
      this.$refs.addruleFormRef.resetFields();
    },
    addRole() {
      this.$refs.addruleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addruleForm);
        if (res.meta.status != 201) {
          this.$message.error("添加角色信息失败！");
        }
        this.adddialogVisible = false;
        this.getRolesList();
        this.$message.success("添加角色信息成功！");
      });
    },
    editRole() {
      this.$refs.editruleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editForm.roleId,
          { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc }
        );
        if (res.meta.status != 200) {
          this.$message.error("修改角色信息失败！");
        }
        this.editdialogVisible = false;
        this.getRolesList();
        this.$message.success("修改角色信息成功！");
      });
    },
    async deleteRole(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户信息, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("删除用户失败！");
      }
      this.getRolesList();

      this.$message({
        type: "success",
        message: "删除用户成功!"
      });
    },
    editClose() {
      this.$refs.editruleFormRef.resetFields();
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      // console.log(res);

      if (res.meta.status != 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.$message.success("查询用户信息成功！")
      this.editForm = res.data;
      // console.log(this.editForm);

      this.editdialogVisible = true;
    },
    async removeRight(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status != 200) {
        return this.$message.error("删除用户失败！");
      }

      this.$message({
        type: "success",
        message: "删除用户成功!"
      });
      role.children = res.data;
    },
    async showSetRights(role) {
      // console.log(role);
      this.roleId=role.id
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status != 200) {
        return this.$message.error("获取权限数据失败！");
      }
      this.$message.success("获取权限数据成功！")
      this.rightsList = res.data;
      this.getLeafKeys(role,this.defKeys)
      this.setrightdialogVisible = true;
    },
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item,arr)
      });
    },
    setRightsClose(){
      this.defKeys=[]
    },
    async allotRights(){
      const keys=[...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      this.setrightdialogVisible = false
    const{data:res} = await  this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
    if(res.meta.status!=200){
      return this.$message.error('分配权限失败！')
    }
    this.$message.success('分配权限成功！')
    this.getRolesList()
    }
  }
};
</script>
<style lang="less" scoped>
.addrolebtn {
  margin-bottom: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
